import React from 'react';
import * as Enzyme from 'enzyme';
import { SensorWithoutState as Sensor } from './Sensor';

describe('Sensor', () => {
  const defaultProps = {};
  let wrapper;
  function createWrapper(overrideProps = {}, method = 'shallow') {
    const props = { ...defaultProps, ...overrideProps };
    return Enzyme[method](<Sensor {...props} />);
  }

  describe('in all cases', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });
    it('keeps state authoritative over input', () => {
      const newState = {
        type: 'Humidity',
        dataPin: 2,
        powerPin: 2,
      };
      wrapper.setState(newState);
      // wrapper.update(); // TODO figure out why you needed this. What's your enzyme version?
      expect(wrapper.find('.js-type')).toHaveValue('Humidity');
      expect(wrapper.find('.js-data-pin')).toHaveValue(2);
      expect(wrapper.find('.js-power-pin')).toHaveValue(2);
    });
    it('updates state in response to input of type, powerPin, and dataPin', () => {
      wrapper.find('.js-type').simulate('change', { target: { value: 'Humidity' } });
      expect(wrapper.state('type')).toBe('Humidity');
      wrapper.find('.js-data-pin').simulate('change', { target: { value: 2 } });
      expect(wrapper.state('dataPin')).toBe(2);
      wrapper.find('.js-power-pin').simulate('change', { target: { value: 2 } });
      expect(wrapper.state('powerPin')).toBe(2);
    });
  });

  describe('new sensor mode', () => {
    describe('create new sensor button', () => {
      const newSensorInfo = {
          type: 'a non-zero-length string',
          dataPin: 1,
          powerPin: 1,
      };
      it('should display when input is valid', () => {
        wrapper = createWrapper();
        expect(wrapper.find('.js-create-sensor')).not.toBePresent();
        wrapper.setState(newSensorInfo);
        expect(wrapper.find('.js-create-sensor')).toBePresent();
      });
      it('should submit a mutation to create a new sensor', () => {
        wrapper = createWrapper({ createSensor: jest.fn() });
        wrapper.setState(newSensorInfo);
        wrapper.find('.js-create-sensor').simulate('click');
        expect(wrapper.instance().props.createSensor).toHaveBeenCalled();
      });
    });
  });

  describe('edit mode', () => {
    const existingSensorProps = {
      _id: 'testId',
      type: 'Moisture',
      dataPin: 1,
      powerPin: 1,
      createSensor: jest.fn(),
      updateSensor: jest.fn(),
      deleteSensor: jest.fn(),
    };
    beforeEach(() => {
      wrapper = createWrapper(existingSensorProps);
    });
    it('populates state from props', () => {
      expect(wrapper.find('.js-type')).toHaveValue('Moisture');
      expect(wrapper.find('.js-data-pin')).toHaveValue(1);
      expect(wrapper.find('.js-power-pin')).toHaveValue(1);
    });
    // In response to a mutation, Sensor's props should change.
    // The state should line up with the props regardless (because the mutation
    // was defined by the Sensor's state), but let's be certain in case of
    // server-side changes like max length, removing padding, etc...
    it('updates state whenever props change', () => {
      wrapper.setProps({
        type: 'Water Level',
        dataPin: 5,
        powerPin: 5,
      });
      expect(wrapper.state()).toEqual(expect.objectContaining({
        _id: 'testId',
        type: 'Water Level',
        dataPin: 5,
        powerPin: 5,
      }));
    });

    describe('Save Changes button', () => {
      it('only shows in edit mode', () => {
        wrapper.setState({ _id: null });
        expect(wrapper.find('.js-update-sensor')).not.toBePresent();
      });
      it('only shows when state differs from props', () => {
        expect(wrapper.find('.js-update-sensor')).not.toBePresent();
        wrapper.setState({ type: 'something else' });
        expect(wrapper.find('.js-update-sensor')).toBePresent();
      });
      it('submits a mutation to update the sensor when clicked', () => {
        wrapper.setState({ type: 'something else' });
        wrapper.find('.js-update-sensor').simulate('click');
        expect(wrapper.instance().props.updateSensor).toHaveBeenCalled();
      });
    });

    describe('Delete Sensor button', () => {
      it('only shows in edit mode', () => {
        wrapper.setState({ _id: null });
        expect(wrapper.find('.js-delete-sensor-sensor')).not.toBePresent();
      });
      it('submits a mutation to delete the sensor on double click.', () => {
        expect(wrapper.find('.js-delete-sensor')).toBePresent();
        wrapper.find('.js-delete-sensor').simulate('click');
        expect(wrapper.instance().props.deleteSensor).not.toHaveBeenCalled();
        expect(wrapper.state('confirmingDelete')).toBe(true);
        wrapper.find('.js-delete-sensor').simulate('click');
        expect(wrapper.instance().props.deleteSensor).toHaveBeenCalled();
      });
    });
  });
});
