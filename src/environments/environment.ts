export const environment = {
  production: false,
  BackendService: `mock` as `mock` | `flask`,
  API: {
    mock: {
      base: `http://127.0.0.1:5000/api/v1`,
      endpoints: {
        algorithm: {
          calculateResult: `/algorithm/{algorithm}?id={dataset_id}`,
        },
        dataset: {
          getAll: `/datasets`,
          create: `/datasets`,
          getRecords: `/datasets/{dataset_id}/records`,
          getSample: `/datasets/{dataset_id}/records/sample`,
          checkStates: `/details/{dataset_id}`,
          checkNullCount: `/nullCount/{dataset_id}`,
          checkTransposeNum: `/transposeNum/{dataset_id}`,
          checkTransposeCat: `/transposeCat/{dataset_id}`,
          checkMissingData: `/missingData/{dataset_id}`,
          checkPairPlot: `/pairPlot/{dataset_id}`,
          checkAllRatio: `/allRatio/{dataset_id}`,
          checkOutLayerValue: `/outLayerValue/{dataset_id}`,
          checkCorrelationValue: `/correlation/{dataset_id}`,
          performEdaColumWise: `/edaColumnWise/{dataset_id}/{column}`,
        },
      },
    },
    flask: {
      base: `http://127.0.0.1:5000/api/v1`,
      endpoints: {
        algorithm: {
          calculateResult: `/algo/{algorithm}?_id={dataset_id}`,
        },
        dataset: {
          getAll: `/file/result/data`,
          create: `/file/import`,
          getRecords: `/file/{dataset_id}/records`,
          getSample: `/file/result/datadetail?id={dataset_id}`,
          checkStates: `/eda/dataset_statistics?id={dataset_id}`,
          checkNullCount: `/eda/findNull?id={dataset_id}`,
          checkTransposeNum: `/eda/transposeNum?id={dataset_id}`,
          checkTransposeCat: `/eda/transposeCat?id={dataset_id}`,
          checkMissingData: `/eda/missing_data?id={dataset_id}`,
          checkAllRatio: `/eda/allRatio?id={dataset_id}`,
          checkPairPlot: `/eda/categorical?id={dataset_id}`,
          checkOutLayerValue: `/eda/outlierval?id={dataset_id}`,
          checkCorrelationValue: `/eda/heatmapVal?id={dataset_id}`,
          performEdaColumWise: `/eda/result?id={dataset_id}&column_name={column}`,
        },
      },
    },
  },
};
