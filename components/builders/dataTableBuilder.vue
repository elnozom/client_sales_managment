<template>
  <v-card class='mt-6'>
    <v-data-table
      :headers="opts.headers"
      :items="datatable.items"
      :loading="loading"
      :items-per-page="100"
      :search="search"
      
      fixed-header
      height="400px"
      sort-by="Name"
      class="elevation-1"
    >
      <template v-slot:top>
        <div class="spacing-playground px-6">
          <v-row>
            <v-col
              v-if="opts.hasDates"
              cols="6"
            >
              <v-menu
                v-model="dateFromMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :label="$t('from')"
                    prepend-icon="mdi-calendar-blank-outline"
                    readonly
                    clearable
                    v-model="DateFrom"
                    v-on="on"
                  ></v-text-field>
                </template>
                <!-- // Determines the type of the picker - date for date picker, month for month picker -->
                <v-date-picker
                  locale="en-in"
                  color="primary"
                  @change="dateFromChanged"
                  no-title
                ></v-date-picker>
              </v-menu>

              <!-- <builders-filter :filter="filter"/> -->
            </v-col>
             <v-col
              v-if="opts.hasDates"
              cols="6"
            >
              <v-menu
                v-model="dateToMenu"
                :close-on-content-click="false"
                    
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    clearable
                    
                    :label="$t('to')"
                    prepend-icon="mdi-calendar-blank-outline"
                    readonly
                    v-model="DateTo"
                    v-on="on"
                  ></v-text-field>
                </template>
                <!-- // Determines the type of the picker - date for date picker, month for month picker -->
                <v-date-picker
                  locale="en-in"
                  color="primary"
                  @change="dateToChanged"
                  no-title
                ></v-date-picker>
              </v-menu>

              <!-- <builders-filter :filter="filter"/> -->
            </v-col>
            <v-col
              v-if="opts.filterable"
              cols="6"
            >
              <v-switch
                @change="finishedChanged"
                :label="$t('finished')"
              ></v-switch>


              <!-- <builders-filter :filter="filter"/> -->
            </v-col>
            <v-col
              v-if="opts.filterable && form.finished"
              cols="6"
            >
              <v-combobox
                @change="deletedChanged"
                :items="deletedCombo"
                :value="deletedCombo[0]"
                item-text="name"
                :label="$t('delete')"
              ></v-combobox>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('inputs.search')"
                clearable
                hide-details
              >
              </v-text-field>
            </v-col>

          </v-row>
          
          <div class="flex-end">

            <v-btn
              v-if="opts.createable == true"
              @click.prevent="create()"
              color="primary"
              :loding="createLoading"
            >
              <v-icon
                right
                dark
                class="ml-3"
              >
                mdi-plus
              </v-icon>{{$t('create')}}
            </v-btn>
          </div>
        </div>

      </template>
      <template v-slot:[`item.TotalCash`]="{ item }">
        {{item.TotalCash.toFixed(2)}}
      </template>
      <template v-slot:[`item.LimitedQnt`]="{ item }">
        <v-edit-dialog @save="!isNaN(updatedLimited) ? update({Serial:item.Serial, LQvalue: parseFloat(updatedLimited)}) : ''">
          <v-chip
            class="ma-2"
            color="red"
            label
            text-color="white"
            v-if="item.LimitedQnt > 0"
          >
            <v-icon left>
              mdi-lock-alert-outline
            </v-icon>
            {{$t('table.limited')}} :
            {{item.LimitedQnt}}
          </v-chip>
          <v-chip
            class="ma-2"
            color="green"
            label
            text-color="white"
            v-else
          >
            <v-icon left>
              mdi-lock-open-variant-outline
            </v-icon>
            {{$t('table.not_limited')}}
          </v-chip>
          <template v-slot:input>
            <v-text-field
              v-model="updatedLimited"
              ref="limited"
              :label="$t(`inputs.limited`)"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.Reserved`]="{ item }">
        <v-chip
          class="ma-2"
          color="red"
          label
          text-color="white"
          v-if="item.Reserved"
        >
          <v-icon left>
            mdi-lock-alert-outline
          </v-icon>
          {{$t('table.reserved')}}
        </v-chip>
        <v-chip
          class="ma-2"
          color="red"
          label
          text-color="white"
          v-else-if="item.StkTr01Serial > 0"
        >
          <v-icon left>
            mdi-lock-alert-outline
          </v-icon>
          {{$t('table.distibuted')}}
        </v-chip>
        <v-chip
          class="ma-2"
          color="purple"
          label
          text-color="white"
          v-else-if="item.Finished == 1"
        >
          <v-icon left>
            mdi-arrow-decision
          </v-icon>
          {{$t('table.under_ditributte')}}
        </v-chip>
        <v-chip
          class="ma-2"
          color="green"
          label
          text-color="white"
          v-else
        >
          <v-icon left>
            mdi-lock-open-variant-outline
          </v-icon>
          {{$t('table.under_edit')}}
        </v-chip>

      </template>
      <template v-slot:[`item.StopSale`]="{ item }">
        <v-chip
          @dblclick="update({Serial : item.Serial, STValue: false})"
          class="ma-2 pointer"
          color="red"
          label
          text-color="white"
          v-if="item.StopSale"
        >
          <v-icon left>
            mdi-lock-alert-outline
          </v-icon>
          {{$t('table.stop_sale')}}
        </v-chip>
        <v-chip
          @dblclick="update({Serial : item.Serial, STValue: true})"
          class="ma-2 pointer"
          color="green"
          label
          text-color="white"
          v-else
        >
          <v-icon left>
            mdi-lock-open-variant-outline
          </v-icon>
          {{$t('table.not_stop_sale')}}
        </v-chip>
      </template>
      <template v-slot:[`item.PMax`]="{ item }">
        <v-edit-dialog
          @save="save(item , 'PMax')"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ item.PMax }}
          <template v-slot:input>
            <v-text-field
              v-model="PMax"
              :label="$t('inputs.edit')"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.PMin`]="{ item }">
        <v-edit-dialog
          @save="save(item , 'PMin')"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ item.PMin }}
          <template v-slot:input>
            <v-text-field
              v-model="PMin"
              :label="$t('inputs.edit')"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div v-if="opts.editable">
          <div v-if=" $route.name == 'stock'">

            <v-btn
              v-if="form.finished == 0 && $auth.user.FixEmpStore > 0"
              @click="editItem(item)"
              color="primary"
              class="mr-4"
            >
              <v-icon
                small
                class="mr-2"
              >
                mdi-pencil
              </v-icon>
              {{$t('table.edit')}}

            </v-btn>

          </div>
          <div v-else class="d-flex align-center">

            <v-btn
              v-if="form.finished == 0"
              @click="editItem(item)"
              color="primary"
              class="mr-4"
            >
              <v-icon
                small
                class="mr-2"
              >
                mdi-pencil
              </v-icon>
              {{$t('table.edit')}}

            </v-btn>
            <v-btn
              v-else
              @click="editItem(item)"
              color="warning"
              class="mr-4 mb-0"
            >
              <v-icon
                small
                class="mx-2"
              >
                mdi-eye
              </v-icon>
              {{$t('table.view')}}
            </v-btn>
            <v-chip
              class="ma-2 pointer"
              color="red"
              label
              text-color="white"
              v-if="item.Deleted"
            >
              <v-icon left>
                mdi-trash
              </v-icon>
              {{$t('table.deleted')}}
            </v-chip>
             <v-btn
              @click="deleteInvoice(item.Serial)"
              v-if="opts.hasDelete && form.finished && !item.Deleted"
              color="danger"
              class="my-4"
            >
              <v-icon
                small
                class="mr-2"
              >
                mdi-trash
              </v-icon>
              {{$t('table.delete')}}

            </v-btn>

            

          </div>

        </div>
        <v-btn
          v-if="opts.viewable"
          @click="viewItem(item)"
          color="warning"
          class="mr-4 mb-0"
        >
          <v-icon
            small
            class="mx-2"
          >
            mdi-eye
          </v-icon>
          {{$t('table.view')}}
        </v-btn>
        

      </template>
      <template v-slot:no-data>
        <span>{{$t('table.no_data')}}</span>
      </template>
    </v-data-table>
    <modals-global-delete @deleted="getData" />

    <slot name="modals"></slot>

  </v-card>
</template>
<script>
import datatable from '@/mixins/builders/datatable.js'
export default {
  mixins: [datatable]
}
</script>
