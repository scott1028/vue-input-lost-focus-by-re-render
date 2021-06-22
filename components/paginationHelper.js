export const INITIAL_PAGE_NO = 1;
export const NOTIFICATION_TIP_PAGE_SIZE = 5;
export const PAGE_SIZE = 10;

export const paginationHelper = ({
  data = [],
  page = INITIAL_PAGE_NO,
  limit = PAGE_SIZE,
}) => {
  const dataStart = (page - 1) * limit;
  const dataEnd = page * limit;
  return data.slice(dataStart, dataEnd);
};

export default paginationHelper;
