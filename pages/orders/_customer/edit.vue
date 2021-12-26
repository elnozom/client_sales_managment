<template>
  <div class="printme">
    <v-card class="relative">
      <div class="no-edit" v-if="isDisabled"></div>
      <v-card-title class="flex justify-space-between">
        <div class="right">
          <p class="block">{{$t('customer')}} :{{$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
          <p class="block">{{$t('employee')}} : {{$auth.user.EmpCode}} / {{$auth.user.EmpName}}</p>
          <div class="d-flex">
            <span class=" text-whitte">{{$t('driver_name')}} : </span>
            <v-edit-dialog @save="updateDriver">
              <span v-if="driverName  != null">{{driverName}}</span>
              <span v-else>{{$t("unknown")}}</span>
              <template v-slot:input>
                <v-text-field
                  :label="$t('driver')"
                  :disabled="isDisabled"
                  v-model="driverName"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </div>
        </div>
        <div class="middle">
          <p class="block">{{$t('order_number')}} : {{docNo}}</p>
          <p class="block">{{$t('date')}} : {{docDate}}</p>
        </div>
        <div
          class="left"
          v-if="totals.TotalCash > 0"
        >
          <v-card>
            <v-card-title class="block">
              <p class="block text-whitte">{{$t('total')}} : EGP{{totals.TotalCash}} </p>
              <div class="d-flex">
                <span class=" text-whitte">{{$t('delivery_fee')}} : </span>
                <v-edit-dialog @save="updateDeliveryFee">
                  {{deliveryFee}}
                  <template v-slot:input>
                    <v-text-field
                      :label="$t('amount')"
                      v-model="deliveryFee"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </div>
            </v-card-title>
          </v-card>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <div
              v-if="error"
              class="danger w-full mt-4"
            >
              <span>{{ $t(`form.errors.${error}`) }}</span>
            </div>
            <v-col
              class="text-center mb-8"
              :cols="3"
            >
              <div class="combobox">
                <v-combobox
                  prepend-icon="mdi-food-steak"
                  v-model="form.item"
                  ref="item"
                  :items="items"
                  :rules="rules"
                  :disabled="isDisabled"
                  :loading="itemsLoaging"
                  clearable
                  item-text="Name"
                  @change="itemChanged"
                  return-object
                  :label="$t(`inputs.item`)"
                ></v-combobox>
                <span v-if="selectProduct">{{$t('select_product')}}</span>

                <!-- <v-icon @click.prevent="createAuthor" >mdi-plus</v-icon> -->
              </div>

            </v-col>
            <v-col
              class="text-center mb-8"
              :cols="3"
            >
              <v-text-field
                ref="qnt"
                prepend-icon="mdi-numeric"
                v-model="form.qnt"
                  :disabled="isDisabled"
                type="number"
                :rules="qntRules"
                @keyup.enter="goToPrice()"
                :label="$t(`inputs.qnt`)"
              ></v-text-field>

            </v-col>
            <v-col
              class="text-center mb-8"
              :cols="3"
            >

              <v-text-field
                ref="price"
                v-model="form.price"
                prepend-icon="mdi-cash-multiple"
                type="number"
                  :disabled="isDisabled"
                :rules="rules"
                :messages="priceHint"
                :label="$t(`inputs.price`)"
                @keyup.enter="priceEntered"
              ></v-text-field>
              <div
                class="danger"
                v-if="priceErr != null && priceErr != ''"
              >{{$t(priceErr)}}</div>

            </v-col>
            <v-col
              class="text-center mb-8"
              :cols="3"
              v-if="$auth.user.SecLevel >= 4"
            >
              <div class="combobox">
                <v-combobox
                  prepend-icon="mdi-home-outline"
                  v-model="form.store"
                  ref="store"
                  :items="stores"
                  :disabled="isDisabled"
                  :loading="storesLoading"
                  clearable
                  item-text="DsiplayName"
                  @change="storeChanged"
                  return-object
                  :label="$t(`inputs.store`)"
                ></v-combobox>
                <span v-if="selectStore">{{$t('select_store')}}</span>

                <!-- <v-icon @click.prevent="createAuthor" >mdi-plus</v-icon> -->
              </div>

            </v-col>
            <v-col :cols="12">
              <base-btn
                :classNames="['primary' , 'mt-5']"
                icon="mdi-content-save-all-outline"
                @clicked="submit"
                text="form.submit"
                :loading="insertLoading"
                :disabled="!valid && errors.length == 0"
              />
            </v-col>
            <v-row class="px-4 pb-4">
              <v-col
                :cols="8"
                v-if="$auth.user.SecLevel >= 4"
              >
                <base-btn
                  :classNames="['primary' , 'my-5']"
                  icon="mdi-check-all"
                  @clicked="save"
                  text="form.save"
                  :loading="insertLoading"
                  :disabled="!valid && errors.length == 0"
                />
              </v-col>
              <v-col :cols="$auth.user.SecLevel >= 4 ? 4: 12">
                <base-btn
                  :classNames="['danger' , 'my-5']"
                  icon="mdi-close-box-outline"
                  @clicked="$router.push({name : 'orders'})"
                  text="form.discard"
                  :loading="insertLoading"
                />
              </v-col>
            </v-row>
          </v-row>
        </v-form>
        <v-data-table
          :headers="headers"
          :items="datatable.items"
          :loading="datatable.loading"
          :items-per-page="100"
          :search="datatable.search"
          fixed-header
          height="400px"
          sort-by="Name"
          class="elevation-1 "
        >
          <template v-slot:top>
            <div class="spacing-playground px-6">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :label="$t('inputs.search')"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </div>

          </template>

          <template v-slot:[`item.Price`]="{ item }">
            <v-edit-dialog
              @save="updatePrice(item)"
              @open="open"
            >
              {{ item.Price }}
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-cash-multiple"
                  v-model="newPrice"
                  :label="$t('inputs.edit')"
                  :messages=" `${$t('from')} : ${item.PriceMin} ${$t('to')} : ${item.PriceMax}`"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Qnt`]="{ item }"  >
            <v-edit-dialog
              @save="updateQnt(item)"
              @open="open"
              v-if="!item.ItemHaveAntherUnit"
            >
              {{ item.Qnt }}
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-cash-multiple"
                  v-model="newQnt"
                  :label="$t('inputs.edit')"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
            <span v-else>{{item.Qnt}}</span>
          </template>
          <template v-slot:[`item.QntAntherUnit`]="{ item }">
            <v-edit-dialog
              @save="updateQnt(item)"
              @open="open"
               v-if="item.ItemHaveAntherUnit"
            >
              {{ item.QntAntherUnit }}
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-cash-multiple"
                  v-model="newQnt"
                  :label="$t('inputs.edit')"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
            <span v-else>{{item.QntAntherUnit}}</span>
          </template>
          <template v-slot:[`item.StoreName`]="{ item }">
            <v-edit-dialog
              @save="updateStore(item)"
              @open="openStore(item)"
            >
              <div v-if="item.StoreName">{{ item.StoreName }}</div>
              <div v-else>{{ $t('undefined') }}</div>
              <template v-slot:input>
                <v-combobox
                  prepend-icon="mdi-home-outline"
                  v-model="updatedStore"
                  ref="store"
                  :items="updateStores"
                  :loading="updateStoresLoading"
                  clearable
                  item-text="DsiplayName"
                  @change="updateStore(item)"
                  return-object
                  :label="$t(`inputs.store`)"
                ></v-combobox>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.delete`]="{ item }">
            <base-btn
              :classNames="['danger']"
              icon="mdi-delete-outline"
              @clicked="deleteItem(item.Serial)"
              text="delete"
              :loading="deleteLoading"
            />
          </template>

          <template v-slot:no-data>
            <span>{{$t('table.no_data')}}</span>
          </template>
          <template v-slot:footer>
            <base-btn
              :classNames="['primary' , 'my-5' , 'print-btn']"
              icon="mdi-printer-outline"
              @clicked="print"
              text="form.print"
              :loading="insertLoading"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      width="300"
      v-model="outOfStockModal"
    >
      <v-card>
        <v-card-text>
          {{$t('out_of_stock')}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="danger"
            @click.prevent="cancel"
          >{{$t('cancle')}}</v-btn>
          <v-btn
            color="success"
            @click.prevent="storeForce"
          >{{$t('continue')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      width="300"
      v-model="outOfStockEditModal"
    >
      <v-card>
        <v-card-text>
          {{$t('out_of_stock')}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="danger"
            @click.prevent="cancel"
          >{{$t('cancle')}}</v-btn>
          <v-btn
            color="success"
            @click.prevent="storeForceEdit(editItem)"
          >{{$t('continue')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      width="300"
      v-model="chooseStore"
    >
      <v-card>
        <v-card-text class="pa-4">
          {{$t('choose_store')}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="success"
            @click.prevent="chooseStore = false"
          >{{$t('continue')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { addParamsToLocation, print } from '@/utils/helpers/Global.js'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import invoice from '@/components/invoice'
export default {
  data() {
    let docDate = new Date().toLocaleString()
    return {
      snack: false,
      search: '',
      chooseStore:false,
      docDate,
      outOfStock: false,
      outOfStockModal: false,
      priceErr: null,
      newQnt: '',
      newPrice: '',
      driverName: null,
      deliveryFee: 0,
      editItem: null,
      docNo: '',
      currentUserIsCreator: false,
      insertLoading: false,
      valid: false,
      error: '',
      errors: [],
      selectProduct: false,
      outOfStockEditModal: false,
      selectStore: false,
      stores: [],
      updatedStore: null,
      updateStoresLoading: false,
      isDisabled:false,
      updateStores: [],

      rules: [(v) => !!v || this.$t('validations.required')],
      qntRules: [
        (v) => {
          if (!v || isNaN(v) || v < 1) return this.$t('validations.min1')
          return true
        }
      ],
      priceHint: '',
      storesLoading: false,
      form: {
        item: '',
        qnt: '',
        store: '',
        price: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      totals: 'order/totals',
      datatable: 'datatable/orderItemsDatatable',
      items: 'item/items',
      serial: 'order/serial',
      itemsLoaging: 'item/loading',
      deleteLoading: 'order/loading'
    }),
    headers() {
      let headers1 = [
        { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
        { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
        { text: this.$t('columns.price'), value: 'Price', align: 'center' },
        { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
        {
          text: this.$t('columns.AnQnt'),
          value: 'QntAntherUnit',
          align: 'center'
        },
        {
          text: this.$t('columns.AvgWeight'),
          value: 'AvgWeight',
          align: 'center'
        },
      ]
      const attach = [
        { text: this.$t('columns.store'), value: 'StoreName', align: 'center' }
      ]
      const header2 = [
        { text: this.$t('columns.total'), value: 'Total', align: 'center' },
        { text: this.$t('columns.delete'), value: 'delete', align: 'center' }
      ]
      if (this.$auth.user.SecLevel >= 4) {
        headers1 = headers1.concat(attach)
      }
      const headers = headers1.concat(header2)

      return headers
    }
  },
  methods: {
    updateDeliveryFee() {
      if (!isNaN(this.deliveryFee)) {
        const payload = {
          DeliveryFee: parseFloat(this.deliveryFee),
          Serial: this.$route.query.serial
        }
        this.$store.dispatch('order/updateOrder', payload)
      }
    },
    updateDriver() {
      const payload = {
        DriverName: this.driverName,
        Serial: this.$route.query.serial
      }
      this.$store.dispatch('order/updateOrder', payload)
    },
    async print() {
      var ComponentClass = Vue.extend(invoice)
      var instance = new ComponentClass({
        propsData: { items: this.datatable.items, query: this.$route.query }
      })
      instance.$mount()
      const prtHtml = instance.$el.innerHTML
      print([prtHtml])
    },
    openStore(item) {
      this.updateStoresLoading = true
      this.$store
        .dispatch('global/getStoresQnt', {
          item: item.ItemSerial,
          qnt: 0
        })
        .then((d) => {
          this.updateStores = d
          this.updateStoresLoading = false
        })
    },
    deleteItem(Serial) {
      this.$store.dispatch('order/deleteItem', { Serial })
    },
    open() {
      console.log('opened')
    },
    cancel() {
      this.form = {
        item: '',
        qnt: '',
        store: '',
        price: ''
      }
      this.outOfStockModal = false
      this.outOfStockEditModal = false

      this.$refs.form.reset()
      setTimeout(() => {
        this.goTo('item')
      }, 300)
    },
    priceEntered() {
      if (this.$auth.user.SecLevel > 4) {
        this.goTo('store')
      } else {
        this.submit()
      }
      const newPrice = parseFloat(this.newPrice)
      this.validatePrice(
        newPrice,
        this.form.item.PriceMin,
        this.form.item.PriceMax
      )
    },
    updatePrice(item) {
      const newPrice = parseFloat(this.newPrice)
      const priceErr = this.validatePrice(
        newPrice,
        item.PriceMin,
        item.PriceMax
      )
      if (priceErr != null) {
        const snackbar = {
          active: true,
          text: priceErr
        }
        if (!this.$store.getters['ui/snackbar'].active)
          this.$store.commit('ui/setSnackbar', snackbar)
        return
      }
      const payload = {
        Qnt: item.Qnt,
        Price: parseFloat(this.newPrice),
        Branch: item.StoreCode,
        Serial: item.Serial
      }
      this.update(payload).then(() => {
        this.newPrice = ''
      })
    },
    updateQnt(item) {
      console.log(item.AvgWeight)
      const payload = item.ItemHaveAntherUnit
        ? {
            QntAntherUnit: parseFloat(this.newQnt),
            Qnt: parseFloat(this.newQnt) * item.AvgWeight,
            Price: item.Price,
            Serial: item.Serial
          }
        : {
            Qnt: parseFloat(this.newQnt),
            Price: item.Price,
            Serial: item.Serial
          }
      this.update(payload)
      this.newQnt = null
    },
    storeForceEdit(item) {
      const payload = {
        Qnt: item.Qnt,
        Price: item.Price,
        Branch: this.updatedStore.StoreCode,
        Serial: item.Serial
      }
      this.update(payload).then(() => {
        this.outOfStockEditModal = false
        this.updatedStore = ''
        this.updateStores = []
      })
    },
    updateStore(item) {
      if (this.updatedStore.Raseed < item.Qnt) {
        this.editItem = item
        this.outOfStockEditModal = true
        return
      }
      this.editItem = null
      this.storeForceEdit(item)
    },
    save() {
      const Serial = parseInt(this.$route.query.serial) || this.serial
      const DocNo = parseInt(this.$route.query.no) || this.DocNo
      for (let i = 0; i < this.datatable.items.length; i++) {
        console.log(!this.datatable.items[i].StoreName)
        console.log(this.datatable.items[i].StoreName)
        if(!this.datatable.items[i].StoreName) {
          this.chooseStore = true
          return
        }
        
      }
      console.log("asd")
      this.$store.dispatch('order/close', { Serial, DocNo }).then((res) => {
        console.log(res)
        let els = []
        res.forEach((doc) => {
          console.log(doc)
          var ComponentClass = Vue.extend(invoice)
          var instance = new ComponentClass({
            propsData: { items: doc, query: this.$route.query }
          })
          instance.$mount()
          const prtHtml = instance.$el.innerHTML
            els.push(prtHtml)
        })
        print(els)
          this.$router.push({name : 'orders'})
      })
    },
    async discard() {
        const unreservePayload = {
            Serial: this.serial,
          Reserved: false
        }
        console.log(unreservePayload)
        this.$store.dispatch('order/updateOrder', unreservePayload)
        this.$store.commit('order/serial', null)
      

      this.$store.dispatch('myAuth/unReserve')
      this.$store.commit('datatable/orderItemsDatatableItems', [])
      this.$store.commit('order/setTotals', {
        TotalCash: null,
        TotalPackages: null
      })

     
    },
    async update(payload) {
      this.$store.dispatch('order/updateItem', payload).then((res) => {
        this.$store.dispatch('datatable/getOrderItems', {
          serial: this.$route.query.serial
        })
      })
    },
    itemChanged() {
      // this.priceRules.push()

      if (typeof this.form.item == 'string') return

      if (this.form.item.StopSale) {
        const snackbar = {
          active: true,
          text: 'item_has_stop_sale'
        }
        this.$store.commit('ui/setSnackbar', snackbar)
        this.reset()
        return
      }
      this.priceHint = `${this.$t('from')} : ${this.form.item.PMin} ${this.$t(
        'to'
      )} : ${this.form.item.PMax}`

      this.storesLoading = true
      this.$store
        .dispatch('global/getStoresQnt', {
          item: this.form.item.Serial,
          qnt: 0
        })
        .then((d) => {
          this.stores = d
          this.storesLoading = false
        })
      this.goTo('qnt')
    },
    goTo(input) {
      this.$refs[input].focus()
    },
    async insertOrder(form) {
      await this.$store.dispatch('order/create', form).then((d) => {
        this.currentUserIsCreator = true
        this.docNo = d.No
        const newQuery = Object.assign({}, this.$route.query, {
          serial: d.Serial,
          no: d.No,
          EmpCode: this.$auth.user.EmpCode
        })
        // set order number on the url
        addParamsToLocation(newQuery, this.$route.path)
      })
    },
    insertOrderItem(form) {
      this.$store.dispatch('order/insertItem', form).then((res) => {
        const total = this.form.item.ItemHaveAntherUnit
          ? parseFloat(this.form.price) *
            parseFloat(this.form.qnt) *
            this.form.item.AvrWeight
          : parseFloat(this.form.price) * parseFloat(this.form.qnt)
        const item = {
          Serial: res.Serial,
          BarCode: this.form.item.Code,
          ItemName: this.form.item.Name,
          ItemSerial: this.form.item.Serial,
          Qnt: form.Qnt,
          QntAntherUnit: form.Qnt * this.form.item.AvrWeight,
          AvgWeight: this.form.item.AvrWeight,
          QntAntherUnit: form.QntAntherUnit || 0,
          Price: parseFloat(this.form.price),
          PriceMax: form.PriceMax,
          PriceMin: form.PriceMin,
          Total: total,
          StoreCode: this.form.store.StoreCode,
          StoreName: this.form.store.StoreName,
          Branch: this.form.store.StoreCode || 0
        }
        console.log(item)
        this.$store.commit('datatable/prependOrderItemsDatatable', item)
        this.reset()
      })
    },
    reset() {
      this.$refs.form.reset()
      this.goTo('item')
      this.priceHint = ''
      this.insertLoading = false
      this.$store.commit('datatable/orderItemsLoading', false)
    },
    validatePrice(price, min, max) {
      if (price < min) {
        return 'validations.min'
      }
      if (price > max) {
        return 'validations.max'
      }
      return null
    },
    init() {
      this.$store.dispatch('global/getCustomer', this.$route.params.customer)
      this.$store.dispatch('item/get', {})
      this.isDisabled= this.$route.query.finished == '1'
      this.docNo = this.$route.query.no
      this.deliveryFee = this.$route.query.deliveryFee || 0
      this.driverName = this.$route.query.driverName || null
      if (this.$route.query.date) this.docDate = this.$route.query.date
      if (this.$route.query.serial) {
        this.$store.commit('order/serial', parseInt(this.$route.query.serial))
        this.$store.dispatch('datatable/getOrderItems', {
          serial: this.$route.query.serial
        })
      }
    },
    goToPrice() {
      if (this.form.qnt != '' && this.form.qnt != null) this.goTo('price')
    },

    storeChanged() {
      if (this.form.store.Raseed < this.form.qnt) {
        this.outOfStock = true
        this.outOfStockModal = true
        return
      }
      this.submit()
    },
    storeForce() {
      this.submit()

      this.outOfStock = false
      this.outOfStockModal = false
    },

    async submit() {
      await this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.insertLoading = true
      // validate the price is in the correct range
      const priceErr = this.validatePrice(
        parseFloat(this.form.price),
        this.form.item.PMin,
        this.form.item.PMax
      )
      if (priceErr != null) {
        this.priceErr = priceErr
        this.insertLoading = false
        return
      }
      this.priceErr = ''
      // validate there is no items inserted
      if (typeof this.form.item == 'string') {
        this.selectProduct = true
        this.insertLoading = false
        return
      }
      // create order
      if (this.datatable.items.length === 0) {
        const orderForm = {
          AccountSerial: parseInt(this.$route.params.customer)
        }
        await this.insertOrder(orderForm)
      }
      //get serial neither from url or from store
      // should be equals
      // if we just opened the page then we depend on url [means we are editing order]
      // if we are just created the order the we depend  on store [means we are creating order]
      const serial = parseInt(this.$route.query.serial) || this.serial
      let itemForm = {
        HeadSerial: serial,
        ItemSerial: this.form.item.Serial,
        Qnt: parseFloat(this.form.qnt),
        Price: parseFloat(this.form.price),
        PriceMax: parseFloat(this.form.item.PMax),
        PriceMin: parseFloat(this.form.item.PMin),
        MinorPerMajor: parseFloat(this.form.item.MinorPerMajor),
        Branch: this.form.store.StoreCode || 0
      }

      if (this.form.item.ItemHaveAntherUnit) {
        itemForm.QntAntherUnit = parseFloat(this.form.qnt)
        itemForm.Qnt =
          parseFloat(this.form.qnt) * parseFloat(this.form.item.AvrWeight)
      }
      //if this is true that means we need to show error because this item has another unit
      // but avgweight is null or 0
      if (itemForm.qnt == 0) {
        const snackbar = {
          active: true,
          text: 'avg_weight_is_zero'
        }
        this.$store.commit('ui/setSnackbar', snackbar)
        this.reset()
        return
      }
      this.insertOrderItem(itemForm)
    }
  },
  async beforeDestroy() {
    this.discard()
  },
  created() {
    this.init()
  }
}
</script>
<style>
.relative{
  position:relative
}
.no-edit{
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  z-index: 100;
  cursor: not-allowed;
}
.print-btn{
  z-index: 101;
}

</style>