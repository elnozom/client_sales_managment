<template>
  <div
    class="invoice"
    id="print"
    ref="invoice"
  >
    <v-card
      :light="true"
      flat
    >
      <div >
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>

                <tr>
                <th>
                   <img
                    style="height : 80px"
                    src="~/assets/img/dental.png"
                    alt=""
                  >
                  <p class="invoice__no" v-if="isInvoice">
                    فاتورة رقم : #{{query.no}}
                  </p>
                  <p class="invoice__no" v-else>
                    طلب رقم : #{{query.no}}
                  </p>
              <!-- <p class="block">العميل :{{query.customer_name}} / {{this.query.customer_code}} </p> -->
<p class="block">
              التاريخ : {{query.date}}
            </p>
            <p class="block">سجل تجاري :{{options.BonMsg3}}</p>
              <p class="block">بطاقة ضريبية :{{options.BonMsg4}} </p>

              <!-- <p class="block">العميل :{{query.customer_name}} / {{this.query.customer_code}} </p> -->
              <p class="block">العميل :{{query.customer_name}} / {{query.customer_code}} </p>


                  
                </th>
                </tr>
                <tr>
                  <th class="text-right">
                    المسلسل
                  </th>
                  <th class="text-right" style="min-width:300px">
                    اسم الصنف
                  </th>
                  <th class="text-right">
                    السعر
                  </th>
                  <th class="text-right">
                    الكمية
                  </th>
                  <th class="text-right" v-if="!isInvoice">
                    الكمية بالكرتونة
                  </th>
                  <th class="text-right">
                    الاجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item , index) in items"
                  :key="item.Name"
                >
                  <td class="text-right">{{ index + 1 }}</td>
                  <td class="text-right" style="min-width:300px">{{ item.ItemName }}</td>
                  <td class="text-right">{{ item.Price }}</td>
                  <td class="text-right">{{ item.Qnt }}</td>
                  <td class="text-right" v-if="!isInvoice">{{ item.QntAntherUnit }}</td>
                  <td class="text-right">{{ item.Total }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </div>
      <!-- <div style="position :fixed;bottom:0; width: 100%;right: 0;padding: 0 50px;">
        <p class="text-center" style="border: 1px solid;padding 10px; margin-top:20px">{{convertTotalToWords}} </p>
        <p class="text-center" style="border: 1px solid;padding 10px; margin-top:20px">{{options.BonMsg5}}</p>
      </div> -->
    </v-card>
  </div>
</template>


<script>
import tafqeet from '@/utils/helpers/Tafqeet.js'
export default {
  methods:{
    tafqeet,
  },
  computed:{
    convertTotalToWords:{
      get: function () {
        let total = (this.TotalCash + (this.TotalCash * .14)).toFixed(2)
          let fractions = total.toString().split('.')
          let pounds = `${tafqeet(fractions[0])} جنيها`
          let cents =  typeof fractions[1] == 'undefined' || fractions[1] == '00' ? '' : `و ${tafqeet(fractions[1])} قرشا`
          let val = `${pounds} ${cents} فقط لا غير`
          return val
      }
    }
  },
    props:[
        'items',
        'query',
        'store',
        'isInvoice',
        'TotalCash',
        'options'
    ]
}
</script>
<style scoped>
p{
  margin:0
}
</style>