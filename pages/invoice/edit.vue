<template>
  <div class="printme">
    <v-card class="relative">
      <div class="no-edit" v-if="isDisabled"></div>
      <v-card-title class="flex justify-space-between">
        <div class="right">
          <p class="block">{{$t('customer')}} :{{$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
          <p class="block">{{$t('employee')}} : {{$auth.user.EmpCode}} / {{$auth.user.EmpName}}</p>
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
              <p class="block text-whitte">{{$t('subtotal')}} : EGP{{(totals.TotalCash).toFixed(2)}} </p>
              <p class="block text-whitte">{{$t('tax')}}(14%) : EGP{{(totals.TotalCash * .14).toFixed(2)}} </p>
              <p class="block text-whitte">{{$t('total')}} : EGP{{(totals.TotalCash + totals.TotalCash * .14).toFixed(2)}} </p>
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
              :cols="4"
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
              :cols="4"
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
              :cols="4"
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
                @keyup.enter="submit"
              ></v-text-field>

            </v-col>
            <v-col cols="12">
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
                  @clicked="$router.push({name : 'invoice'})"
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

          <template v-slot:[`item.ItemName`]="{ item }">
            <v-edit-dialog
              @save="updateItemName(item)"
            >
              {{ item.ItemName }}
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-cash-multiple"
                  v-model="newName"
                  :label="$t('inputs.edit')"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Price`]="{ item }">
            <v-edit-dialog
              @save="updatePrice(item)"
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
            >
            <span >{{item.Qnt}}</span>
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-cash-multiple"
                  v-model="newQnt"
                  :label="$t('inputs.edit')"
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
          <template v-slot:footer>
            <base-btn
              :classNames="['primary' , 'my-5' , 'print-btn']"
              icon="mdi-printer-outline"
              @clicked="print"
              :disabled="printLoading"
              text="form.print"
              :loading="insertLoading"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    


    

  </div>
</template>

<script>
import { addParamsToLocation, print  } from '@/utils/helpers/Global.js'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import invoice from '@/components/invoice'

export default {
  data() {
    let docDate = new Date().toLocaleString()
    return {
      snack: false,
      search: '',
      docNo:"",
      docDate,
      newQnt: '',
      newPrice: '',
      editItem: null,
      newName:null,
      printLoading:false,
      currentUserIsCreator: false,
      insertLoading: false,
      valid: false,
      error: '',
      errors: [],
      selectProduct: false,
      isDisabled:false,
      rules: [(v) => !!v || this.$t('validations.required')],
      qntRules: [
        (v) => {
          if (!v || isNaN(v) || v < 1) return this.$t('validations.min1')
          return true
        }
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
      // totals: 'order/totals',
      datatable: 'datatable/invoiceItemsDatatable',
      items: 'item/items',
      itemsLoaging: 'item/loading',
      deleteLoading: 'order/loading'
    }),
     
   serial:{
      get : function(){
        return  this.$store.getters['order/invoiceSerial']
      },
      set : function(serial){
        return this.$store.commit("order/invoiceSerial" , serial)
      }
    },
    totals(){
      let TotalsCash = 0
      this.datatable.items.forEach(item => {
        TotalsCash += item.Price * item.Qnt
      })
      return {
        TotalCash : TotalsCash
      }
    },
    headers() {
     return [
        { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
        { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
        { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
        { text: this.$t('columns.price'), value: 'Price', align: 'center' },
         { text: this.$t('columns.total'), value: 'Total', align: 'center' },
        { text: this.$t('columns.delete'), value: 'delete', align: 'center' }
        
      ]
    }
  },
  methods: {
    async print() {
      this.printLoading = true
      var ComponentClass = Vue.extend(invoice)
      let query = {...this.$route.query}
      query.no = this.docNo
      query.date = this.docDate
      console.log(query);
      var instance = new ComponentClass({
        propsData: { TotalCash : this.totals.TotalCash, isInvoice: true ,items: this.datatable.items, query: query , options: this.$store.getters['global/posOptions'] }
      })
      instance.$mount()
      const prtHtml = instance.$el.innerHTML
      print([prtHtml]).then(() => {
        this.printLoading = false
      })
    },
    deleteItem(Serial) {
      this.$store.dispatch('order/deleteInvoiceItem', Serial ).then(() => {
        this.$store.dispatch('datatable/getInvoiceItems',  this.serial)
        .then((val) => {
          if(val == null || val ==[]){
            this.$router.push({name : 'invoice'})
          }
        })
      })
    },
   
    cancel() {
      this.form = {
        item: '',
        qnt: '',
        price: ''
      }
      this.$refs.form.reset()
      setTimeout(() => {
        this.goTo('item')
      }, 300)
    },
    
    updateItemName(item) {
      const payload = {
        Qnt: item.Qnt,
        QntAntherUnit: item.QntAntherUnit,
        Price: item.Price,
        ItemName: this.newName,
        Serial: item.Serial
      }
      this.update(payload).then(() => {
        this.newName = ''
      })
    },
    updatePrice(item) {
      const newPrice = parseFloat(this.newPrice)
      const payload = {
        Qnt: item.Qnt,
        Price: newPrice,
        QntAntherUnit: item.QntAntherUnit,
        ItemName: item.ItemName,
        Serial: item.Serial
      }
      this.update(payload).then(() => {
        this.newPrice = ''
      })
    },
    updateQnt(item) {
      const payload = {
            Qnt: parseFloat(this.newQnt),
            ItemName: item.ItemName,
            Price: item.Price,
            Serial: item.Serial
          }
      this.update(payload)
      this.newQnt = null
    },
    save() {
      const Serial = parseInt(this.$route.query.serial) || this.serial
      const DocNo = parseInt(this.$route.query.no) || parseInt(this.docNo)
      this.$store.dispatch('order/closeInvoice', { Serial, DocNo }).then((res) => {
          this.$router.push({name : 'invoice'})
      })
    },
    async discard() {
      const unreservePayload = {
          Serial: this.serial,
        Reserved: false
      }
      this.$store.dispatch('order/updateInvoice', unreservePayload)
      this.$store.commit('order/invoiceSerial', null)
      this.$store.dispatch('myAuth/unReserve')
      this.$store.commit('datatable/invoiceItems', [])
     
    },
    async update(payload) {
      this.$store.dispatch('order/updateInvoiceItem', payload).then((res) => {
        this.$store.dispatch('datatable/getInvoiceItems',this.serial)
      })
    },
    itemChanged() {
      if (typeof this.form.item == 'string') return
      this.goTo('qnt')
    },
    goTo(input) {
      this.$refs[input].focus()
    },
    async insertOrder(form) {
      await this.$store.dispatch('order/createInvoice', form).then((d) => {
        this.currentUserIsCreator = true
        this.docNo = d.No
        this.serial = d.Serial
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
      this.$store.dispatch('order/insertInvoiceItem', form).then((res) => {
        const total = parseFloat(this.form.price) * parseFloat(this.form.qnt)
        const item = {
          Serial: res,
          BarCode: this.form.item.Code,
          ItemName: this.form.item.Name,
          ItemSerial: this.form.item.Serial,
          Qnt: form.Qnt,
          QntAntherUnit:form.QntAntherUnit,
          Price: parseFloat(this.form.price),
          PriceMax: form.PriceMax,
          PriceMin: form.PriceMin,
          Total: total,
        }
        this.$store.commit('datatable/prependInvoiceItemsDatatable', item)
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
    init() {
      this.$store.dispatch('item/get', {})
      this.isDisabled= this.$route.query.finished == '1'
      this.docNo = this.$route.query.no
      this.deliveryFee = this.$route.query.deliveryFee || 0
      this.driverName = this.$route.query.driverName || null
      if (this.$route.query.date) this.docDate = this.$route.query.date
      if (this.$route.query.serial) {
        this.$store.commit('order/invoiceSerial', parseInt(this.$route.query.serial))
        this.$store.dispatch('datatable/getInvoiceItems',  this.$route.query.serial)
      }
    },
    goToPrice() {
      if (this.form.qnt != '' && this.form.qnt != null) this.goTo('price')
    },


    async submit() {
      await this.$refs.form.validate()
      if (!this.valid) {
        return
      }

      this.insertLoading = true
     
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
      // if we are just created the order then we depend  on store [means we are creating order]
      const serial = parseInt(this.$route.query.serial) || this.serial
      let itemForm = {
        HeadSerial: serial,
        ItemSerial: this.form.item.Serial,
        Qnt: parseFloat(this.form.qnt),
        Price: parseFloat(this.form.price),
        PriceMax: parseFloat(this.form.item.PMax),
        PriceMin: parseFloat(this.form.item.PMin),
        MinorPerMajor: parseFloat(this.form.item.MinorPerMajor),
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