<template>
<div class="printme">
  <v-card>
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
              @keyup.enter="qntChanged()"
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
              @keyup.enter="goTo('store')"
            ></v-text-field>
            <span v-if="priceErr != null">{{$t(priceErr)}}</span>

          </v-col>
          <v-col
            class="text-center mb-8"
            :cols="3"
          >
            <div class="combobox">
              <v-combobox
                prepend-icon="mdi-home-outline"
                v-model="form.store"
                ref="store"
                :items="stores"
                :rules="rules"
                :loading="storesLoading"
                clearable
                item-text="StoreName"
                @change="submit"
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
        <template v-slot:[`item.StoreName`]="{ item }">
          <v-edit-dialog
            @save="updateStore(item)"
            @cancel="cancel"
            @open="openStore(item)"
          >
            {{ item.StoreName }}
            <template v-slot:input>
             <v-combobox
                prepend-icon="mdi-home-outline"
                v-model="updatedStore"
                ref="store"
                :items="updateStores"
                :loading="updateStoresLoading"
                clearable
                item-text="StoreName"
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
                :classNames="['primary' , 'my-5']"
                icon="mdi-printer-outline"
                @clicked="print"
                text="form.print"
                :loading="insertLoading"
              />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <div class="invoice"  id="print" ref="invoice">

  <v-card :light="true" flat>
    <v-card-title>
      <div class="d-flex w-full justify-space-between">
        <p class="invoice__no">
          رقم : #{{docNo}}
        </p>
        <p class="invoice__no">
          التاريخ : {{docDate}}
        </p>
      </div>
    </v-card-title>
    <v-card-subtitle class="my-12">
      <div class="d-flex w-full justify-space-between">
        <div class="">
          <h2 class="mb-4">امر بيع</h2>
          <p class="block">العميل :{{$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>

        </div>
        <img style="height : 60px" src="~/assets/img/logo.png" alt="">
      </div>
      <div class="divider"></div>
    </v-card-subtitle>
    <v-card-text>
      <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-right">
            كود الصنف
          </th>
           <th class="text-right">
            اسم الصنف
          </th>
          <th class="text-right">
            السعر
          </th>
          <th class="text-right">
           الكمية
          </th>
           <th class="text-right">
           الكمية بالكرتونة
          </th>
          <th class="text-right">
           الاجمالي
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in datatable.items"
          :key="item.Name"
        >
          <td class="text-right">{{ item.BarCode }}</td>
          <td class="text-right">{{ item.ItemName }}</td>
          <td class="text-right">{{ item.Price }}</td>
          <td class="text-right">{{ item.Qnt }}</td>
          <td class="text-right">{{ item.QntAntherUnit }}</td>
          <td class="text-right">{{ item.Total }}</td>
        </tr>
        <tr
        >
          <td class="text-right" colspan="5"></td>
          <td class="text-right totlas">
            <div>اجمالي العبوات : {{totals.TotalPackages}}</div>
            <div>الاجمالي : EGP{{totals.TotalCash}}</div>
          </td>
         
         
        </tr>
      </tbody>
    </template>
  </v-simple-table>
    </v-card-text>
  </v-card>
  
  </div>

</div>
</template>

<script>
import { addParamsToLocation } from '@/utils/helpers/Global.js'
import { mapGetters } from 'vuex'
export default {
  data() {
  let docDate = new Date().toLocaleString();
    return {
      snack: false,
      search: '',
      docDate,
      priceErr: null,
      newQnt: '',
      newPrice: '',
      docNo:'',
      currentUserIsCreator: false,
      insertLoading: false,
      valid: false,
      error: '',
      errors: [],
      selectProduct: false,
      selectStore: false,
      stores:[],
      updatedStore:null,
      updateStoresLoading:false,
      updateStores:[],

      rules: [(v) => !!v || this.$t('validations.required')],
      qntRules: [
        (v) => {
          if (!v || isNaN(v) || v < 1) return this.$t('validations.min1')
        }
      ],
      priceHint: '',
      storesLoading:false,
      form: {
        item: '',
        qnt: '',
        store:'',
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
    headers(){
       let headers1 = [
      { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
      { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
      { text: this.$t('columns.price'), value: 'Price', align: 'center' },
    ]
    const attach = [
        { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
        { text: this.$t('columns.AnQnt'), value: 'QntAntherUnit', align: 'center' },
        { text: this.$t('columns.AvgWeight'), value: 'AvgWeight', align: 'center' },
    ]
    const header2 = [
       { text: this.$t('columns.store'), value: 'StoreName', align: 'center' },
       { text: this.$t('columns.total'), value: 'Total', align: 'center' },
      { text: this.$t('columns.delete'), value: 'delete', align: 'center' }
    ]
    if(this.$auth.user.SecLevel >= 4) {
       headers1 = headers1.concat(attach)
    }
    const headers = headers1.concat(header2)

    return headers
    }
  },
  methods: {
    async print(){
     
   const prtHtml = document.getElementById('print').innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
    
          <head>
            ${stylesHtml}
            <style>
              .invoice{
                display:flex !important;
                
              }
              .v-application{
                display:flex !important;
                justify-content:center !important
              }
            </style>
          </head>
        <body>
        <div data-app="true" class="v-application relative v-application--is-rtl theme--light" id="app">
          ${prtHtml}
          </div>
        </body>
      </html>`);
      WinPrint.document.close();
      WinPrint.focus();
      setTimeout(() => {
        WinPrint.print();
        WinPrint.close();
        
      }, 100);
    },
    openStore(item){
      this.updateStoresLoading = true
      console.log(item)
      this.$store.dispatch('global/getStoresQnt' , {item:item.ItemSerial , qnt:item.QntAntherUnit}).then(d => {
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
      console.log('cancled')
    },

    updatePrice(item) {
      console.log(item)
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
        this.newPrice = ""
      })
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
    updateStore(item){
       const payload = {
        Qnt: item.Qnt,
        Price: item.Price,
        Branch: this.updatedStore.StoreCode,
        Serial: item.Serial
      }
      this.update(payload).then(() => {
        this.updatedStore = ""
        this.updateStores = []
      })
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
        const total = this.form.item.ItemHaveAntherUnit ?  parseFloat(this.form.price) * parseFloat(this.form.qnt) * this.form.item.AvrWeight : parseFloat(this.form.price) * parseFloat(this.form.qnt)
        const item = {
          Serial: res.Serial,
          BarCode: this.form.item.Code,
          ItemName: this.form.item.Name,
          ItemSerial: this.form.item.Serial,
          Qnt: form.Qnt,
          QntAntherUnit: form.Qnt * this.form.item.AvrWeight,
          AvgWeight:  this.form.item.AvrWeight,
          QntAntherUnit: form.QntAntherUnit || 0,
          Price: parseFloat(this.form.price),
          PriceMax: form.PriceMax,
          PriceMin: form.PriceMin,
          Total: total,
          Branch:this.form.store.StoreCode
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
      this.docNo = this.$route.query.no
      if(this.$route.query.date) this.docDate = this.$route.query.date
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
    qntChanged(){
      this.storesLoading = true
      this.$store.dispatch('global/getStoresQnt' , {item:this.form.item.Serial , qnt:this.form.qnt}).then(d => {
        this.stores = d
        this.storesLoading = false
      })
      this.goToPrice()
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
        Branch:this.form.store.StoreCode
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
   
    this.$store.dispatch('myAuth/unReserve')
      this.$store.commit('datatable/orderItemsDatatableItems' , [])
      this.$store.commit('order/setTotals' , {
        TotalCash: null,
        TotalPackages: null
    })
      

  },
  created() {
    this.init()
  }
}
</script>
