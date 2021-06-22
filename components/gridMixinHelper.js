import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';

import paginationHelper from './paginationHelper';

const LOG = console.log;
const pageSize = 10;

export const GridMixinHelper = ({
  namespace = '',
  tableConfig = [],
  restoreData = ({ vm }) => {
    throw new Error('To implement ViewModal', vm);
  },
  paginated = true,
  onSearch = async ({ vm, userSearched, value }) => {
    throw new Error('To implement async data fetching', vm, userSearched, value);
  },
} = {}) => ({
  data() {
    return {
      [`${namespace}refresh`]: noop,
      [`${namespace}userSearched`]: false,
      [`${namespace}input`]: {
        search: null,
      },
      [`${namespace}page`]: {
        pageSize: paginated ? pageSize : get(restoreData({ vm: this }), 'length'),
        currentPage: paginated ? get(this, '$router.currentRoute.query.page', 1) : 1,
      },
      [`${namespace}tableConfig`]: tableConfig.call ? tableConfig({ vm: this }) : tableConfig,
    };
  },
  computed: {
    [`${namespace}viewTableData`]() {
      const data = restoreData({ vm: this });
      const paginatedTableData = paginated ? paginationHelper({
        data,
        page: get(this, `${namespace}page.currentPage`),
        size: get(this, `${namespace}page.pageSize`),
      }) : data;
      return paginatedTableData;
    },
    [`${namespace}total`]() {
      return get(restoreData({ vm: this }), 'length');
    }
  },
  methods: {
    async [`${namespace}search`]({ userSearched = false, value = null, page = 1 } = {}) {
      set(this, `${namespace}refresh`, async () => {
        await onSearch({ vm: this, userSearched, value });
        get(this, `${namespace}setPage`)({ page });
        set(this, `${namespace}userSearched`, userSearched);
      });
      await get(this, `${namespace}refresh`, noop)();
    },
    async [`${namespace}setPage`]({ page }) {
      set(this, `${namespace}page.currentPage`, page);
    },
    [`${namespace}deletableChecker`]() {
      throw new Error('Not implemented');
    },
    [`${namespace}getItem`]() {
      throw new Error('Not implemented');
    },
    [`${namespace}addItem`]() {
      throw new Error('Not implemented');
    },
    [`${namespace}modifyItem`]() {
      throw new Error('Not implemented');
    },
    [`${namespace}removeItem`]() {
      throw new Error('Not implemented');
    },
  },
  fetch() {
    // NOTE: `mounted` will run before those component.data prepared, so switch to `fetch`.
    this.$fetch && get(this, `${namespace}search`)({ userSearched: false });
    LOG('fetch', namespace);
  },
  mounted() {
    // NOTE: make is compatible with normal vue component rather than nuxt page component.
    !this.$fetch && get(this, `${namespace}search`)({ userSearched: false });
    LOG('mounted', namespace);
  },
});

export default GridMixinHelper;
