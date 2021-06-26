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

                   Caveat! There is a special prop named `key`, it will be supported for any component by default.
                   Also Vue will use `key` prop and the rest of this rendered-component's `props` to determine if this component should be rerender or not,
                   in case you use same component definition. For example, when you interact with a input tag of a row,
                   you should make `key` of row refer to same value so that when you trigger `onInput` event,
                   the whole `DOM` of row will not be re-rendered and cause focus-losing.

                   [Important]
                   In most of situations, `component` or `key` changed cause this DOM rerendering issue.
                   Here I say again that only whole `DOM` rerendered causes focus-losing issue,
                   if it's just event component re-binding that will not cause this issue.

                   <Row key={key}>  <= if key value is not changed, `Row` component will not be rerendered.
                    <Cell item={item} />  <= if your `item` prop is changed,`Cell` component will be rerendered. Event though `Row` component is not rendered.
                   </Row>
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
