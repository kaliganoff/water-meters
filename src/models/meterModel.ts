import { types } from "mobx-state-tree"

const data = {"id":"526a0caae0e34c3e6dda9c07","_type":["HotWaterAreaMeter","AreaMeter"],"area":{"id":"526237d3e0e34c524382c158"},"is_automatic":null,"communication":"5b20f6bb64c0360001ed10ee","description":"464","serial_number":"","installation_date":"2012-02-01T00:00:00","brand_name":null,"model_name":null,"initial_values":[0.0]}

const meterItem = types.model({
    id: types.string,
    _type: types.array(types.string),

})