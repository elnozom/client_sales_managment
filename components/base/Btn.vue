<template>
    <v-btn
            :class="classNames"
            class="w-full"
            :loading="loading"
            :disabled="disabled"
            @click.prevent="$emit('clicked')"
          >
            <v-icon
              right
              dark
              class="ml-3"
            >
              {{icon}}
            </v-icon>{{$t(text)}}
          </v-btn>
</template>

<script>
export default {
    props: {
        classNames:Array,
        disabled:{
          type : Boolean,
          default : false,
        },
        icon: String,
        text: String,
        loading: Boolean
    },
   
}
</script>