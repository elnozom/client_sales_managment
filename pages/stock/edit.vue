<template>
  <div class="printme">
    <v-card>
      <v-card-title class="flex justify-space-between">
        <div class="right">
          <p class="block">{{$t('customer')}} :{{$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
          <p class="block">{{$t('employee')}} : {{$route.query.emp_name}}</p>
          <p class="block" v-if="isDisabled">{{$t('stock_employee')}} : {{$route.query.stock_emp_name}}</p>
          <div class="d-flex">
                <span v-if="driverName  != null" class=" text-whitte">{{$t('driver_name')}} : </span>
                <span v-if="driverName  != null">{{driverName}}</span>
              </div>
        </div>
        <div class="middle">
          <p class="block">{{$t('order_number')}} : {{$route.query.no}}</p>
          <p class="block">{{$t('date')}} : {{$route.query.date}}</p>
          <p class="block">{{$t('columns.storeName')}} : {{$route.query.store}}</p>
        </div>
        <div
          class="left" 
        >
          <v-card>
            <v-card-title class="block">
              <p class="block text-whitte">{{$t('total')}} : EGP {{totalCash}} </p>
              <div class="d-flex">
                <span class=" text-whitte">{{$t('delivery_fee')}} : </span>
                <span class=" text-whitte">{{deliveryFee}} </span>
              
              </div>
            </v-card-title>
          </v-card>
        </div> 
      </v-card-title>
      <v-card-text>
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
          <template v-slot:[`item.Qnt`]="{ item }" v-if="!isDisabled">
            <v-edit-dialog
              @save="updateQnt(item)"
              
            >
              {{ item.Qnt }}
              <template v-slot:input>
                <v-text-field
                  prepend-icon="mdi-database"
                  v-model="newQnt"
                  :label="$t('inputs.qnt')"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:no-data>
            <span>{{$t('table.no_data')}}</span>
          </template>
          <template v-slot:footer>
            <base-btn
              :classNames="['primary' , 'my-5']"
              icon="mdi-send"
              @clicked="save"
              text="form.send"
            />
            
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- <div
      class="invoice"
      id="print"
      ref="invoice"
    >

      <v-card
        :light="true"
        flat
      >
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
            <img
              style="height : 60px"
              src="~/assets/img/logo.png"
              alt=""
            >
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
                <tr>
                  <td
                    class="text-right"
                    colspan="5"
                  ></td>
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
      


    </div> -->

  </div>
</template>

<script>
import { print } from '@/utils/helpers/Global.js'
export default {
  data() {
    return {
      snack: false,
      driverName:"",
      deliveryFee:0,
      search: '',
      newQnt: '',
      docNo: '',
      isDisabled : false,
    }
  },
  computed: {
   
    datatable(){
      return this.$store.getters['datatable/stcOrderItemsDatatable']
    },
    totalCash(){
      let totalCash = 0
      this.datatable.items.forEach(item => {
          totalCash += item.Price * item.Qnt
      }); 
      return totalCash
    },
    headers() {
      let headers = [
        { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
        { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
        { text: this.$t('columns.price'), value: 'Price', align: 'center' },
        {
          text: this.$t('columns.AnQnt'),
          value: 'QntAntherUnit',
          align: 'center'
        },
          { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
           { text: this.$t('columns.total'), value: 'Total', align: 'center' },
      ]
      
      return headers
    }
  },
  methods: {
    
    async print() {
      var ComponentClass = Vue.extend(invoice)
      var instance = new ComponentClass({
        propsData: { items: this.datatable.items, query: this.$route.query }
      })
      instance.$mount()
      const prtHtml = instance.$el.innerHTML
      print([prtHtml])
     
    },
  
    updateQnt(item) {
      const payload =  {
            Qnt: parseFloat(this.newQnt),
            Serial: item.Serial
          }
      this.$store.dispatch('order/updateStcItem', payload).then(res => {
        this.newQnt = null
        this.$store.dispatch('datatable/getStcOrderItems', {
          serial: this.$route.query.serial
        })
      })
    },
   
    save() {
      this.$store.dispatch('order/stcClose',  {serial :parseInt(this.$route.query.serial) , emp : this.$auth.user.EmpCode}).then(() => {
        this.$router.push({ name: 'stock' })
      })
    },
    
  
    init() {
      this.$store.dispatch('item/get', {})
      this.docNo = this.$route.query.no
      this.isDisabled= this.$route.query.finished == '1'
      this.deliveryFee = this.$route.query.deliveryFee || 0
      this.driverName = this.$route.query.driverName || null
      // if (this.$route.query.date) this.docDate = this.$route.query.date
        this.$store.dispatch('datatable/getStcOrderItems', {
          serial: this.$route.query.serial
        })
      
    },
  },
  created() {
    this.init()
  }
}
</script>
