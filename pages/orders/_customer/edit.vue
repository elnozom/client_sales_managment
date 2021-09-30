<template>
  <v-card>
    <v-card-title class="flex justify-between">
      <div class="right">
        <p class="block">{{$t('customer')}} :{{$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
        <p class="block">{{$t('employee')}} : {{$auth.user.EmpCode}} / {{$auth.user.EmpName}}</p>
      </div>
      <div class="middle">
        <p class="block">{{$t('order_number')}} : 1548</p>
        <p class="block">{{$t('date')}} : {{new Date().toISOString().slice(0, 10)}}</p>
      </div>
      <div
        class="left"
        v-if="totals.TotalCash > 0"
      >
        <v-card>
          <v-card-title class="block">
            <p class="block text-whitte">{{$t('total')}} : EGP{{totals.TotalCash}} </p>
            <!-- <p class="block text-whitte">{{$t('total_packages')}} : {{totals.TotalPackages}}</p> -->
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
              type="number"
              :rules="qntRules"
              :label="$t(`inputs.qnt`)"
              @keyup.enter="goToPrice()"
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
              :rules="rules"
              :messages="priceHint"
              :label="$t(`inputs.price`)"
              @keyup.enter="submit"
            ></v-text-field>
            <span v-if="priceErr != null">{{$t(priceErr)}}</span>

          </v-col>
          <v-col :cols="3">
            <base-btn
              :classNames="['primary' , 'mt-5']"
              icon="mdi-content-save-all-outline"
              @clicked="submit"
              text="form.submit"
              :loading="insertLoading"
              :disabled="!valid && errors.length == 0"
            />
          </v-col>
          <v-row
            class="px-4 pb-4"
            v-if="$auth.user.SecLevel >= 4"
          >
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
                @clicked="discard"
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
        class="elevation-1"
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

        <template v-slot:[`item.Qnt`]="{ item }">
          <v-edit-dialog
            @save="updateQnt(item)"
            @cancel="cancel"
            @open="open"
          >
            <span v-if="item.ItemHaveAntherUnit">{{ item.QntAntherUnit }}</span>
            <span v-else>{{ item.Qnt }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="newQnt"
                :label="$t('inputs.edit')"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.Price`]="{ item }">
          <v-edit-dialog
            @save="updatePrice(item)"
            @cancel="cancel"
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
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { addParamsToLocation } from '@/utils/helpers/Global.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      snack: false,
      search: '',
      priceErr: null,
      newQnt: '',
      newPrice: '',
      currentUserIsCreator: false,
      insertLoading: false,
      valid: false,
      error: '',
      errors: [],
      selectProduct: false,
      rules: [(v) => !!v || this.$t('validations.required')],
      qntRules: [
        (v) => {
          if (!v || isNaN(v) || v < 1) return this.$t('validations.min1')
        }
      ],

      headers: [
        { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
        { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
        { text: this.$t('columns.price'), value: 'Price', align: 'center' },
        { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
        { text: this.$t('columns.total'), value: 'Total', align: 'center' },
        { text: this.$t('columns.delete'), value: 'delete', align: 'center' }
      ],
      priceHint: '',
      form: {
        item: '',
        qnt: '',
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
    })
  },
  methods: {
    deleteItem(Serial) {
      this.$store.dispatch('order/deleteItem', { Serial })
    },
    open() {
      console.log('opened')
    },
    cancel() {
      console.log('cancled')
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
        Serial: item.Serial
      }
      this.update(payload)
    },
    updateQnt(item) {
      const payload = item.ItemHaveAntherUnit
        ? {
            Qnt: parseFloat(this.newQnt) * item.AvrWeight,
            Price: item.Price,
            Serial: item.Serial
          }
        : {
            Qnt: parseFloat(this.newQnt),
            Price: item.Price,
            Serial: item.Serial
          }
      this.update(payload)
    },
    save() {
      const Serial = parseInt(this.$route.query.serial) || this.serial
      this.$store.dispatch('order/close', { Serial }).then(() => {
        this.$router.push({ name: 'orders' })
      })
    },
    async discard() {
      const Serial = parseInt(this.$route.query.serial) || this.serial
      this.$store
        .dispatch('order/updateOrderReserved', { Serial, Reserved: false })
        .then(() => {
          this.$router.push({ name: 'orders' })
        })
    },
    async update(payload) {
      this.$store.dispatch('order/updateItem', payload)
    },
    itemChanged() {
      // this.priceRules.push()

      if (typeof this.form.item == 'string') return

      if(this.form.item.StopSale){
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
      this.goTo('qnt')
    },
    goTo(input) {
      this.$refs[input].focus()
    },
    async insertOrder(form) {
      await this.$store.dispatch('order/create', form).then((serial) => {
        this.currentUserIsCreator = true
        const newQuery = Object.assign({}, this.$route.query, {
          serial,
          EmpCode: this.$auth.user.EmpCode
        })
        // set order number on the url
        addParamsToLocation(newQuery, this.$route.path)
      })
    },
    insertOrderItem(form) {
      this.$store.dispatch('order/insertItem', form).then((res) => {
        const total = parseFloat(this.form.price) * parseFloat(this.form.qnt)
        const item = {
          Serial: res.Serial,
          BarCode: this.form.item.Code,
          ItemName: this.form.item.Name,
          Qnt: form.Qnt,
          QntAntherUnit: form.QntAntherUnit || 0,
          Price: parseFloat(this.form.price),
          PriceMax: form.PriceMax,
          PriceMin: form.PriceMin,
          Total: total
        }
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
      if (this.$route.query.serial) {
        this.$store.dispatch('datatable/getOrderItems', {
          serial: this.$route.query.serial
        })
        const Serial = parseInt(this.$route.query.serial) || this.serial
        this.$store.dispatch('order/updateOrderReserved', {
          Serial,
          Reserved: true
        })
      }
    },
    goToPrice(){
      if(this.form.qnt != '' && this.form.qnt != null  ) this.goTo('price') 
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
        MinorPerMajor: parseFloat(this.form.item.MinorPerMajor)
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
    const Serial = parseInt(this.$route.query.serial) || this.serial
    this.$store.dispatch('order/updateOrderReserved', {
      Serial,
      Reserved: false
    })
  },
  created() {
    this.init()
  }
}
</script>