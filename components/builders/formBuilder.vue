<template>
  <v-card class="pa-4">
    <!-- <v-card-title class="primary mb-4 d-flex justify-between">
      <h2>{{ $t(`form.${opts.title}`) }}</h2>
      <v-spacer />
      <v-switch
        v-if="opts.hiddenAble"
        v-model="metaHidden"
        color="white"
        :label="$t('form.hide_none_required')"
      ></v-switch>
    </v-card-title> -->
    <v-card-text>
      <v-form
        ref="form"
        v-model="opts.valid"
        lazy-validation
      >
        <v-row>
          <div
            v-if="opts.error"
            class="danger w-full mt-4"
          >
            <span>{{ $t(`form.errors.${opts.error}`) }}</span>
          </div>
          <v-col
            v-for="(input, index) in opts.inputs"
            :key="index"
            class="text-center mb-8"
            :cols="input.cols"
          >
            <div
              v-if="input.type == 'text'"
              class="text"
            >
              <v-text-field
                :ref="input.ref"
                v-model="form[input.prop]"
                :error="opts.errors.hasOwnProperty(input.prop)"
                :error-messages="opts.errors[input.prop] ? $t(`validations.${opts.errors[input.prop]}`) : ''"
                :type="input.inputType"
                :rules="typeof input.rules == 'undefined' ? [] : input.rules"
                :hint="input.hint"
                :label="$t(`inputs.${input.label}`)"
                @keyup.enter="enter(input)"
                @blur="blur(input)"
                @input="changed(input)"
              ></v-text-field>
              <slot
                name="textInput"
                v-if="input.inputType == 'text'"
                :input="input"
              />
              <slot
                name="numberInput"
                v-if="input.inputType == 'number'"
                :input="input"
              />
            </div>
            <div
              v-if="input.type == 'select'"
              class="select"
            >
              <v-select
                v-model="form[input.prop]"
                :ref="input.ref"
                :items="input.items"
                :rules="typeof input.rules == 'undefined' ? [] : input.rules"
                :error="opts.errors.hasOwnProperty(input.prop)"
                :error-messages="opts.errors[input.prop] ? $t(`validations.${opts.errors[input.prop]}`) : ''"
                :clearable="input.clearable"
                :loading="input.loading"
                :item-text="input.inputText"
                :item-value="input.inputValue"
                :label="$t(`inputs.${input.label}`)"
              ></v-select>
            </div>
            <div
              v-if="input.type == 'textarea'"
              class="textarea"
            >
              <v-textarea
                v-model="form[input.prop]"
                :ref="input.ref"
                :label="$t(`inputs.${input.label}`)"
                :rules="typeof input.rules == 'undefined' ? [] : input.rules"
                :error="opts.errors.hasOwnProperty(input.prop)"
                :error-messages="opts.errors[input.prop] ? $t(`validations.${opts.errors[input.prop]}`) : ''"
                auto-grow
                :rows="input.rows"
              ></v-textarea>
            </div>
            <div
              v-if="input.type == 'combobox'"
              class="combobox"
              :class="input.class ? input.class : ''"
            >
              <v-combobox
                v-model="form[input.prop]"
                :ref="input.ref"
                :items="input.items"
                :rules="typeof input.rules == 'undefined' ? [] : input.rules"
                :error="opts.errors.hasOwnProperty(input.prop)"
                :loading="input.loading"
                :error-messages="opts.errors[input.prop] ? $t(`validations.${opts.errors[input.prop]}`) :''"
                :clearable="input.clearable"
                :item-text="input.inputText"
                :item-value="input.inputValue"
                @keyup.enter="enter(input)"
                @change="changed(input)"
                :return-object="false"
                :label="$t(`inputs.${input.label}`)"
              ></v-combobox>
              <!-- <v-icon @click.prevent="createAuthor" >mdi-plus</v-icon> -->
            </div>
            <div
              v-if="input.type === 'switch'"
              class="switch"
            >
              <v-switch
                v-model="form[input.prop]"
                :label="$t(`inputs.${input.label}`)"
              ></v-switch>
            </div>
            <div
              v-if="input.type === 'treeview'"
              class="treeview"
            >
              <v-treeview
                v-model="form[input.prop]"
                selectable
                :selection-type="input.selectType"
                :item-text="input.inputText"
                :item-value="input.inputValue"
                :items="input.items"
              ></v-treeview>
              <!-- <v-btn @click.prevent="saveCategories">save my choices</v-btn> -->
            </div>
            <div v-if="input.type === 'autcomplete'">
              <v-autocomplete
                :search-input.sync="form[input.prop]"
                :items="input.items"
                :loading="input.loading"
                color="white"
                hide-no-data
                hide-selected
                :filter="input.filter"
                :item-text="input.inputText"
                :autofocus="input.autofocus"
                :item-value="input.inputValue"
                :label="$t(`inputs.${input.label}`)"
                @keyup.enter="enter(input)"
                @blur="blur(input)"
                @keydown="changed(input)"
                return-object
              ></v-autocomplete>
            </div>
          </v-col>
          <v-col :cols="opts.btnCols ? opts.btnCols : 12">
            <base-btn
              :classNames="['primary' , 'mt-5']"
              icon="mdi-content-save-all-outline"
              @clicked="submit"
              text="form.submit"
              :loading="loading"
              :disabled="!opts.valid && opts.errors.length == 0"
            />
            
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script>
import form from '@/mixins/builders/form.js'

export default {
  mixins: [form]
}
</script>