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
  name: 'TableV2',
  props: {
    tableConfig: Array,
    tableData: Array,
  },
  render() {
    return (
      <div>
        {
          this.tableData.map((item, idx) => {
            const Cells = this.tableConfig.map((columnCfg, colIdx) => {
              const ComponentFactory = _.chain(columnCfg).get('component', null).value();
              if (_.chain(ComponentFactory).isFunction().value()) {
                const Component = ComponentFactory({ item });
                return (
                  <DefaultCell key={`${idx}-${colIdx}`}>
                    <Component item={item} />
                  </DefaultCell>
                );
              }
              return (
                <DefaultCell key={`${idx}-${colIdx}`}>
                  <ComponentFactory {...item} />
                </DefaultCell>
              );
            });
            return (
              <DefaultRow key={`${idx}`}>
                { Cells }
              </DefaultRow>
            )
          })
        }
      </div>
    );
  },
};
</script>
