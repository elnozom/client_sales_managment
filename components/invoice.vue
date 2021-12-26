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
      <v-card-title>
        <div class="d-flex w-full justify-space-between">
          <p class="invoice__no">
            رقم : #{{query.no}}
          </p>
          <p class="invoice__no">
            التاريخ : {{query.date}}
          </p>
        </div>
      </v-card-title>
      <v-card-subtitle class="my-12">
        <div class="d-flex w-full justify-space-between">
          <div class="">
            <h2 class="mb-4">امر بيع</h2>
            <p class="block">العميل :{{query.customer_name}} / {{this.query.customer_code}} </p>
            
            <p class="block">مخزن :{{items[0].StoreName}} </p>

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
                v-for="item in items"
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
                <!-- <td class="text-right totlas">
                  <div>اجمالي العبوات : {{totals.TotalPackages}}</div>
                  <div>الاجمالي : EGP{{totals.TotalCash}}</div>
                </td> -->

              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
export default {
    props:[
        'items',
        'query',
        'store'
    ]
}
</script>