<template>
  <v-card>
    <v-card-title class="flex justify-between">
      <div class="right">
        <p class="block">{{$t('customer')}} :{{this.$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
        <p class="block">{{$t('employee')}} : {{this.$store.state.auth.employee.EmpName}} / {{this.$store.state.auth.employee.EmpCode}}</p>
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
            <p class="block text-whitte">{{$t('total_packages')}} : {{totals.TotalPackages}}</p>
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
                v-model="form.item"
                ref="item"
                :items="items"
                :rules="[required]"
                :loading="itemsLoaging"
                clearable
                item-text="Name"
                @change="itemChanged"
                return-object
                :label="$t(`inputs.item`)"
              ></v-combobox>
              <!-- <v-icon @click.prevent="createAuthor" >mdi-plus</v-icon> -->
            </div>

          </v-col>
          <v-col
            class="text-center mb-8"
            :cols="3"
          >
            <v-text-field
              ref="qnt"
              v-model="form.qnt"
              type="number"
              :rules="[required , number]"
              :label="$t(`inputs.qnt`)"
              @keyup.enter="goTo('price')"
            ></v-text-field>

          </v-col>
          <v-col
            class="text-center mb-8"
            :cols="3"
          >

            <v-text-field
              ref="price"
              v-model="form.price"
              type="number"
              :rules="[required, number]"
              :messages="priceHint"
              :label="$t(`inputs.price`)"
              @keyup.enter="submit"
            ></v-text-field>
            <span v-if="priceErr != null">{{priceErr}}</span>

          </v-col>
          <v-col :cols="3">
            <v-btn
              color="success"
              class="w-full block mt-5"
              :disabled="!valid && errors.length == 0"
              :loading="insertLoading"
              @click.prevent="submit"
            >
              {{$t('form.submit')}}
            </v-btn>
          </v-col>
          <v-col :cols="12">
            <v-btn
              color="success"
              class="w-full block mt-5"
              :disabled="datatable.items.length == 0"
              :loading="insertLoading"
              @click.prevent="close"
            >
              {{$t('form.close')}}
            </v-btn>
          </v-col>
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
            @save="save(item)"
            @cancel="cancel"
            @open="open"
          >
            {{ item.Qnt }}
            <template v-slot:input>
              <v-text-field
                v-model="newQnt"
                :label="$t('inputs.edit')"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.delete`]="{ item }">

          <v-btn
            danger
            @click="deleteItem(item.Serial)"
          >{{$t('delete')}}</v-btn>
        </template>

        <template v-slot:no-data>
          <span>{{$t('table.no_data')}}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { required, number, min, max } from '@/utils/helpers/Validations.js'
import { addParamsToLocation } from '@/utils/helpers/Global.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      required,
      snack: false,
      search: '',
      priceErr: null,
      newQnt: '',
      insertLoading: false,
      valid: false,
      error: '',
      errors: [],
      headers: [
        { text: this.$t('columns.code'), value: 'BarCode', align: 'center' },
        { text: this.$t('columns.name'), value: 'ItemName', align: 'center' },
        { text: this.$t('columns.price'), value: 'Price', align: 'center' },
        { text: this.$t('columns.qnt'), value: 'Qnt', align: 'center' },
        { text: this.$t('columns.total'), value: 'Total', align: 'center' },
        { text: this.$t('columns.delete'), value: 'delete', align: 'center' }
      ],
      number,
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
      itemsLoaging: 'item/loading'
    })
  },
  methods: {
    deleteItem(Serial) {
      this.$store.dispatch('order/deleteItem', { Serial })
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = this.$t('table.opened')
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = this.$t('table.cancled')
    },
    save(item) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = this.$t('table.saved')
      // MinValue , MaxValue
      const payload = { Qnt: parseFloat(this.newQnt), Serial: item.Serial }
     
      this.update(payload)
    },
    close() {
      const Serial = this.$route.query.order || this.serial
      this.$store.dispatch('order/close', { Serial }).then(() => {
        this.$router.push({name : "orders-index" })
      })
    },
    async update(payload) {
      this.$store.dispatch('order/updateItem', payload)
    },
    itemChanged() {
      // this.priceRules.push()
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
        const newQuery = Object.assign({}, this.$route.query, { serial })
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
          Qnt: parseFloat(this.form.qnt),
          Price: parseFloat(this.form.price),
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
    validatePrice() {
      //validate the price
      const price = parseFloat(this.form.price)
      if (price < this.form.item.PMin) {
        this.priceErr = this.$t('validations.min')
        this.insertLoading = false
        return false
      }
      if (price > this.form.item.PMax) {
        this.priceErr = this.$t('validations.max')
        this.insertLoading = false
        return false
      }
      this.priceErr = null
      return true
    },
    init() {
      this.$store.dispatch('global/getCustomer', this.$route.params.customer)
      this.$store.dispatch('item/get', {})
      if (this.$route.query.serial) {
        this.$store.dispatch('datatable/getOrderItems', {
          serial: this.$route.query.serial
        })
      }
    },
    async submit() {
      this.insertLoading = true
      // validate the price is in the correct range
      if(!this.validatePrice()) return
      // validate there is no items inserted
      // create order
      if (this.datatable.items.length === 0) {
        const orderForm = {
          AccountSerial: this.$route.params.customer,
          EmpCode: this.$store.getters['auth/employee'].EmpCode
        }
        await this.insertOrder(orderForm)
      }
      //get serial neither from url or from store
      // should be equals
      // if we just opened the page then we depend on url [means we are editing order]
      // if we are just created the order the we depend  on store [means we are creating order]
      const serial = this.$route.query.order || this.serial
      const itemForm = {
        HeadSerial: serial,
        ItemSerial: this.form.item.Serial,
        Qnt: parseFloat(this.form.qnt),
        Price: parseFloat(this.form.price)
      }

      this.insertOrderItem(itemForm)
    }
  },
  created() {
    this.init()
  }
}
</script>