import { Column } from "components/DataTable/Column";

export const Columns: Column[] = [
    { 
        id: 'asset', 
        label: 'Asset', 
        minWidth: 40 
    },
    {
        id: 'price',
        label: 'Price',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toFixed(2),
    },
    {
        id: 'utilization',
        label: 'Utilization',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'supplyAPR',
        label: 'sAPR (%)',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'borrowAPR',
        label: 'bAPR (%)',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'aBase',
        label: 'Base',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'aElastic',
        label: 'Elastic',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'bBase',
        label: 'Base',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'bElastic',
        label: 'Elastic',
        minWidth: 40,
        // align: 'right',
        //   format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  interface Data {
    asset: number | string
    price: number | string
    utilization: number | string
    supplyAPR: number | string
    borrowAPR: number | string

    aBase: number | string
    aElastic: number | string
    bBase: number | string
    bElastic: number | string
}

export function createData(
    asset: number | string,
    price: number | string,
    utilization: number | string,
    supplyAPR: number | string,
    borrowAPR: number | string,

    aBase: number | string,
    aElastic: number | string,
    bBase: number | string,
    bElastic: number | string
): Data {
//   const density = population / size;
  return { asset, price, utilization, supplyAPR, borrowAPR, aBase, aElastic, bBase, bElastic };
}