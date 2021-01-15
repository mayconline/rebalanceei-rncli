export const getArraySortByParams = (array: any[], params: string) => {
  return array
    .map(all => all)
    .sort((a, b) => {
      let itema = a[params];
      let itemb = b[params];

      if (typeof itema === 'number') {
        return itemb - itema;
      } else {
        if (itemb < itema) return 1;
        if (itemb > itema) return -1;
        return 0;
      }
    });
};
