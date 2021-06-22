<template>
  <div class="container">
    <div>
      <!-- <Logo />
      <h1 class="title">
        myTestNuxtApp
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div> -->
      <base-table
        :deletable-checker="() => false"
        :table-config="tableConfig"
        :table-data="viewTableData"
        :manager="'App'"
      />
      <pre>-> {{ viewTableData }}</pre>
    </div>
  </div>
</template>
<script>
import get from 'lodash/get';
import _ from 'lodash';
import BaseTable from '~/components/TableV2';
import GridMixinHelper from '~/components/gridMixinHelper';

export default {
  components: {
    BaseTable,
  },
  mixins: [
    GridMixinHelper({
      tableConfig: ({ vm }) => [
        {
          label: 'AccountID', component: ({ item }) => ({
            data() {
              return {
                value: _.chain(item).get('vault.account', '').cloneDeep().value(),
              };
            },
            render() {
              return (
                // NOTE: in vault.js#L49
                <input
                  vModel={this.value}
                  onBlur={() => {
                    const newItem = _.chain(item).cloneDeep().value();
                    _.chain(newItem).set('vault.account', this.value).value();
                    vm.onItemChanged(newItem);
                  }}
                />
              );
            },
          }),
        },
      ],
      restoreData: ({ vm }) => get(vm, 'formDataList'),
      onSearch: async ({ vm }) => {
        const output = [
          { vault: { account: Date.now(), user: Date.now() } },
          { vault: { account: Date.now(), user: Date.now() } },
        ];
        vm.formDataList = _.chain(output).cloneDeep().value();
      },
    }),
  ],
  data() {
    return {
      formDataList: [],
    }
  },
  methods: {
    async onItemChanged(item) {
      console.debug('onItemChanged/item:', item);
      const appId = _.chain(item).get('id').value();
      const nextFormDataList = _.chain(this).get('formDataList').cloneDeep().value();
      const nextStateByAppIdMapper = _.chain(nextFormDataList).keyBy('id').value();
      // const nextUpdatedFormDataList = _.chain(this).get('updatedFormDataList').cloneDeep().value();
      // const nextUpdatedFormDataListByAppIdMapper = _.chain(nextUpdatedFormDataList).keyBy('id').value();
      // const originalTarget = _.chain(nextUpdatedFormDataListByAppIdMapper).get(appId, {}).value();
      const target = _.chain(nextStateByAppIdMapper).get(appId, {}).value();
      _.chain(target).merge(item).value();
      // _.chain(this).set('updatedFormDataList', nextFormDataList).value();
      _.chain(this).set('formDataList', nextFormDataList).value();
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
