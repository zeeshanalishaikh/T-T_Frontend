export const environment = {
  production: false,
  BackendService: `mock` as `mock` | `flask`,
  API: {
    mock: {
      base: `http://127.0.0.1:5000/api/v1`,
      endpoints: {
        algorithm: {
          calculateResult: `/algorithm/{algorithm}?id={dataset_id}`
        },
        dataset: {
          getAll: `/datasets`,
          create: `/datasets`,
          getRecords: `/datasets/{dataset_id}/records`,
          getSample: `/datasets/{dataset_id}/records/sample`
        }
      }
    },
    flask: {
      base: `http://127.0.0.1:5000/api/v1`,
      endpoints: {
        algorithm: {
          calculateResult: `/algo/{algorithm}?_id={dataset_id}`
        },
        dataset: {
          getAll: `/file/result/data`,
          create: `/file/import`,
          getRecords: `/file/{dataset_id}/records`,
          getSample: `/file/result/datadetail?id={dataset_id}`
        }
      }
    }
  }
};
