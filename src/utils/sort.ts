export const getArraySortByParams = <T>(
  array: Array<T>,
  params: string,
): Array<T> => {
  return array
    .map<any>(all => all)
    .sort((a, b) => {
      let itema = a[params];
      let itemb = b[params];

      if (typeof itema === 'number' && typeof itemb === 'number') {
        return itemb - itema;
      } else {
        if (itemb < itema) return 1;
        if (itemb > itema) return -1;
        return 0;
      }
    });
};
