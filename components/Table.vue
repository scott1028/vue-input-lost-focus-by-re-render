<script>
import styled from 'vue-styled-components';
import _ from 'lodash';

const DefaultRow = styled.div`
  display: flex;
`;

const DefaultCell = styled.div`
  border: 2px solid #666;
  flex: 1;
`;

export default {
  name: 'Table',
  functional: true,
  props: {
    tableConfig: Array,
    tableData: Array,
    onBlur1: Function,
  },
  render(h, { props }) {
    console.log('Table/render:', Date.now());
    return (
      <div>
        <table>
          {
            props.tableData.map((item, idx) => {
              const Component = props.tableConfig[0].component();
              return (
                /* TESTCASE-02: Ref: https://forum.vuejs.org/t/how-to-prevent-a-list-from-getting-reordered-upon-updating-an-element/85944/4
                                Not sure if we skip key, it will always be re-rendered or not.
                                Duplicate keys detected: 'xxxx'. This may cause an update error.

                   Caveat! Also Vue will use `key` prop and the rest of rendering component `props` to determine if this component should be rerender or not,
                   in case you use same component definition. For example, when you interact with a input tag of a row,
                   you should make `key` of row refer to same value so that when you trigger `onInput` event,
                   the whole DOM of row will not be re-rendered and cause focus-losing.
                 */
                <DefaultRow key={idx}>
                  <td><Component item={item} /></td>
                </DefaultRow>
              )
            })
          }
        </table>
      </div>
    );
  },
};
</script>
