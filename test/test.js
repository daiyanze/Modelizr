import { describe, it } from 'mocha'
import { expect } from 'chai'
import OrderedList from '../src'
import {
  initData,
  insertData,
  unshiftData,
  pushData,
  updateData,
  removeData
} from './data.js'

describe('OrderedList Behaviours', () => {
  describe('#initialize(not array of Object)', () => {
    [undefined, null, {}, 1, 'string', false].forEach(d => {
      it(`should return an empty Map: ${d}`, () => {
        const model = new OrderedList(undefined)
        expect(model.size).to.equal(0)
      })
    })
  })

  describe('#initialize()', () => {
    const model = new OrderedList(initData)
    it('should have data within', () => {
      expect(model).to.have.property('data')
      expect(model.size).to.be.above(0)
    })

    it('should contain all of the given data', () => {
      for (const d of initData) {
        const res = model.findOne(d.id)
        expect(res).to.not.be.undefined
        expect(res.name).to.equal(d.name)
      }
    })
  })

  describe('#findOne()', () => {
    const model = new OrderedList(initData)
    it('should return data if exists', () => {
      expect(model.findOne(1)).not.to.be.undefined
    })

    it('should return undefined if data not exsits', () => {
      expect(model.findOne(100)).to.be.undefined
    })
  })

  describe('#findList()', () => {
    const model = new OrderedList(initData)
    it('should return a not empty array if query exists', () => {
      expect(model.findList([1, 2])).to.have.lengthOf(2)
    })

    it('should return an empty array if query doesnot exist', () => {
      expect(model.findList(['1234', '5678'])).to.have.lengthOf(0)
    })
  })

  describe('#insertOne()', () => {
    const model = new OrderedList(initData)
    model.insertOne(insertData, 1)
    it('should inserted new data', () => {
      expect(model.size).to.equal(initData.length + 1)
    })

    it('should have the inserted data right after the given id', () => {
      expect(model.keys[1]).to.equal(1.5)
    })
  })

  describe('#unshift()', () => {
    const model = new OrderedList(initData)
    model.unshift(unshiftData)
    it('should have new data', () => {
      expect(model.size).to.equal(initData.length + unshiftData.length)
      for (const d of unshiftData) {
        const res = model.findOne(d.id)
        expect(res.name).to.equal(d.name)
      }
    })

    it('should have the new data at beginning', () => {
      expect(model.first.id).to.equal(unshiftData[0].id)
    })
  })

  describe('#push()', () => {
    const model = new OrderedList(initData)
    model.push(pushData)
    it('should have new data', () => {
      expect(model.size).to.equal(initData.length + pushData.length)
      for (const d of pushData) {
        const res = model.findOne(d.id)
        expect(res.name).to.equal(d.name)
      }
    })

    it('should have the new data in the end', () => {
      expect(model.last.id).to.equal(pushData[0].id)
    })
  })

  describe('#update()', () => {
    const model = new OrderedList(initData)
    model.update(updateData)
    it('should have updated data', () => {
      expect(model.size).to.equal(initData.length)
      for (const d of updateData) {
        const res = model.findOne(d.id)
        expect(res.name).to.equal(d.name)
      }
    })
  })

  describe('#remove()', () => {
    const model = new OrderedList(initData)
    model.remove(removeData)
    it('should have deleted data', () => {
      expect(model.size).to.equal(initData.length - removeData.length)
      for (const d of removeData) {
        const res = model.findOne(d.id)
        expect(res).to.be.undefined
      }
    })
  })

  describe('#mutate()', () => {
    const model = new OrderedList(initData)
    model
      .unshift(unshiftData)
      .push(pushData)
    function filter(model, conditions) {
      const keys = Object.keys(conditions)
      return model.values.filter(v => {
        let res = true
        for (const k of keys) {
          const c = conditions[k].contain
          const e = conditions[k].exclude
          if (c && c.length) {
            res = res && c.some(d => d === v[k])
          }
          if (e && e.length) {
            res = res && e.every(d => d !== v[k])
          }
        }
        return res
      })
    }
    // Leave only data of id:1
    const conditions = {
      id: { contain: [1, 2] },
      name: { exclude: ['second'] }
    }
    it('should mutate inner data after being filtered', () => {
      model.mutateBy(filter, conditions)
      expect(model.size).to.equal(1)
      const res = model.findOne(1)
      expect(res).not.to.be.undefined
      expect(res.id).to.equal(1)
    })

    it('should remove all inner data', () => {
      model.mutateBy(() => {
        return []
      })
      expect(model.size).to.equal(0)
    })
  })
})
