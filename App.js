import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
  },
});

const MAX_HOURS = 24;
const MAX_MINUTES = 60;

export default class TimePicker extends Component {
  static propTypes = {
    selectedHours: PropTypes.number,
    selectedMinutes: PropTypes.number,
    onChange: PropTypes.func,
    hourIntervals: PropTypes.number,
    minuteIntervals: PropTypes.number,
    startHours: PropTypes.number,
    startMinutes: PropTypes.number,
    endHours: PropTypes.number,
    endMinutes: PropTypes.number,
    minMinutes: PropTypes.number,
    hoursUnit: PropTypes.string,
    minutesUnit: PropTypes.string,
    testIDPrefix: PropTypes.string
  }

  static defaultProps = {
    selectedHours: 0,
    selectedMinutes: 0,
    onChange: null,
    hourIntervals: 1,
    minuteIntervals: 1,
    startHours: 0,
    startMinutes: 0,
    endHours: MAX_HOURS,
    endMinutes: MAX_MINUTES,
    minMinutes: 0,
    hoursUnit: '',
    minutesUnit: '',
    testIDPrefix: '',
  }

  constructor(props) {
    super(props);
    const { selectedHours, selectedMinutes } = props;
    this.state = {
      selectedHours,
      selectedMinutes,
    };
  }

  getHoursItems = () => {
    const items = [];
    const { hoursUnit, hourIntervals, startHours, endHours } = this.props;
    for (let i = startHours; i <= parseInt(endHours/hourIntervals); i++) {
      items.push(
        <Picker.Item key={i * hourIntervals} value={i * hourIntervals} label={`${(i * hourIntervals).toString()}${hoursUnit}`} />,
      );
    }
    return items;
  }

  getMinutesImtes = () => {
    const items = [];
    const { minutesUnit, minuteIntervals, minMinutes, endHours, endMinutes } = this.props;
    const { selectedHours } = this.state;
    for (let i = 0; i < parseInt(MAX_MINUTES/minuteIntervals); i++) {
      if(selectedHours == endHours && i*minuteIntervals+minMinutes >= endMinutes) {
        items.push(
          <Picker.Item key={endMinutes} value={endMinutes} label={`${(endMinutes).toString()}${minutesUnit}`} />,
        );
        break;
      } else {
        items.push(
          <Picker.Item key={i*minuteIntervals+minMinutes} value={i*minuteIntervals+minMinutes} label={`${(i*minuteIntervals+minMinutes).toString()}${minutesUnit}`} />,
        );
      }
    }
    return items;
  }

  handleChangeHours = (itemValue) => {
    const { onChange, startHours, endHours, startMinutes, endMinutes, minuteIntervals, minMinutes } = this.props;
    const { selectedMinutes } = this.state;
    this.setState({
      selectedHours: itemValue,
      selectedMinutes: itemValue == endHours && selectedMinutes >= endMinutes 
        ? endMinutes
        : itemValue == startHours && selectedMinutes <= startMinutes
          ? startMinutes
          : (selectedMinutes - minMinutes) % minuteIntervals !== 0 
            ? minMinutes
            : selectedMinutes
    }, () => {
      const { selectedHours, selectedMinutes } = this.state;
      onChange(selectedHours, selectedMinutes);
    });
  }

  handleChangeMinutes = (itemValue) => {
    const { onChange, startHours, endHours, startMinutes, endMinutes } = this.props;
    const { selectedHours } = this.state;
    if ((selectedHours == startHours && itemValue < startMinutes) || (selectedHours == endHours && itemValue > endMinutes)) 
        {
            return;
        }
    this.setState({
      selectedMinutes: itemValue,
    }, () => {
      const { selectedHours, selectedMinutes } = this.state;
      onChange(selectedHours, selectedMinutes);
    });
  }

  handleChangeTime = (hour,minute) => {
    const { onChange } = this.props;
    this.setState({selectedHours:hour,
      selectedMinutes:minute}, () => {
      const { selectedHours, selectedMinutes } = this.state;
      onChange(selectedHours, selectedMinutes);
    });
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    const { testIDPrefix } = this.props;
    return (
      <View style={styles.container}>
        <Picker
          testID={`${testIDPrefix}HoursPicker`}
          style={styles.picker}
          selectedValue={selectedHours}
          onValueChange={(itemValue) => this.handleChangeHours(itemValue)}
        >
          {this.getHoursItems()}
        </Picker>
        <Picker
          testID={`${testIDPrefix}MinutesPicker`}
          style={styles.picker}
          selectedValue={selectedMinutes}
          onValueChange={(itemValue) => this.handleChangeMinutes(itemValue)}
        >
          {this.getMinutesImtes()}
        </Picker>
      </View>
    );
  }
}
