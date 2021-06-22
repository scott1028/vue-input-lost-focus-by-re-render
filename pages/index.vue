<template>
  <div class="container">
    <div>
      <my-table
        :deletable-checker="() => false"
        :table-config="tableConfig"
        :table-data="viewTableData"
        :manager="'App'"
        :on-blur1="onBlur"
      />
      <!--
        <table>
          <tr v-for="(item,i) in formDataList" :key="i">
            <td><input :value="item.id" @blur="onBlur(item, item.id, 'id')" /></td>
            <td><input :value="item.vault.user" @blur="onBlur(item, item.vault.user, 'vault.user')" /></td>
          </tr>
        </table>
      -->
      <pre>viewTableData: {{ JSON.stringify(viewTableData, null, 2) }}</pre>
    </div>
  </div>
</template>
<script>
import get from 'lodash/get';
import _ from 'lodash';
import MyTable from '~/components/Table';
import GridMixinHelper from '~/components/gridMixinHelper';

export default {
  components: {
    MyTable,
  },
  mixins: [
    GridMixinHelper({
      tableConfig: ({ vm }) => [
        {
          label: 'AccountID',
          component: _.chain(() => ({     // NOTE: Without `memoize`, This causes whole re-render, because function alway return a new instance.
          // component: ({                // NOTE: will not cause whole re-render
            props: {
              item: Object,
            },
            data() {
              return {
                value: _.chain(this.item).get('vault.account', '').cloneDeep().value(),
              };
            },
            render() {
              return (
                <input
                  vModel={this.value}
                  onBlur={() => {
                    const newItem = _.chain(this.item).cloneDeep().value();
                    _.chain(newItem).set('vault.account', this.value).value();
                    vm.onItemChanged(newItem);
                  }}
                />
              );
            },
          }))
          // TESTCASE-01: make component act like a pure-component of React
          .memoize()
          .value(),
        },
        {
          label: 'AccountID',
          component: _.chain(() => ({     // NOTE: Without `memoize`, This causes whole re-render, because function alway return a new instance.
          // component: ({                // NOTE: will not cause whole re-render
            props: {
              item: Object,
            },
            data() {
              return {
                value: _.chain(this.item).get('vault.account', '').cloneDeep().value(),
              };
            },
            render() {
              return (
                <input
                  vModel={this.value}
                  onBlur={() => {
                    const newItem = _.chain(this.item).cloneDeep().value();
                    _.chain(newItem).set('vault.account', this.value).value();
                    vm.onItemChanged(newItem);
                  }}
                />
              );
            },
          }))
          // TESTCASE-01: make component act like a pure-component of React
          .memoize()
          .value(),
        },
      ],
      restoreData: ({ vm }) => get(vm, 'formDataList'),
      onSearch: async ({ vm }) => {
        const output = [
          { id: 1, vault: { account: Date.now(), user: Date.now() } },
          { id: 2, vault: { account: Date.now(), user: Date.now() } },
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
    onBlur(item, value, path) {
      // TESTCASE-01: check this if it's triggered while re-rendering.
      console.log('onBlur is invoked/item,value,path:', item, value, path);
      const newItem = _.chain(item).cloneDeep().value();
      _.chain(newItem).set(path, value).value();
      debugger;
      this.onItemChanged(newItem);
    },
    async onItemChanged(item) {
      console.debug('onItemChanged/item:', item);
      const appId = _.chain(item).get('id').value();
      const nextFormDataList = _.chain(this).get('formDataList').cloneDeep().value();
      const nextStateByAppIdMapper = _.chain(nextFormDataList).keyBy('id').value();
      const target = _.chain(nextStateByAppIdMapper).get(appId, {}).value();
      _.chain(target).merge(item).value();
      _.chain(this).set('formDataList', nextFormDataList).value();
    },
  },
}
</script>
<style>
pre {
  white-space: pre;
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  text-align: left;
}
</style>
