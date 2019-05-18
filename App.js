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
    hoursUnit: PropTypes.string,
    minutesUnit: PropTypes.string,
  }

  static defaultProps = {
    selectedHours: 0,
    selectedMinutes: 0,
    onChange: null,
    hourIntervals: 1,
    minuteIntervals: 1,
    hoursUnit: '',
    minutesUnit: '',
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
    const { hoursUnit } = this.props;
    for (let i = 0; i <= parseInt(MAX_HOURS/hourIntervals); i++) {
      items.push(
        <Picker.Item key={i * hourIntervals} value={i * hourIntervals} label={`${(i * hourIntervals).toString()}${hoursUnit}`} />,
      );
    }
    return items;
  }

  getMinutesImtes = () => {
    const items = [];
    const { minutesUnit } = this.props;
    for (let i = 0; i <= parseInt(MAX_MINUTES/minuteIntervals); i++) {
      items.push(
        <Picker.Item key={i*minuteIntervals} value={i*minuteIntervals} label={`${(i*minuteIntervals).toString()}${minutesUnit}`} />,
      );
    }
    return items;
  }

  handleChangeHours = (itemValue) => {
    const { onChange } = this.props;
    this.setState({
      selectedHours: itemValue,
    }, () => {
      const { selectedHours, selectedMinutes } = this.state;
      onChange(selectedHours, selectedMinutes);
    });
  }

  handleChangeMinutes = (itemValue) => {
    const { onChange } = this.props;
    this.setState({
      selectedMinutes: itemValue,
    }, () => {
      const { selectedHours, selectedMinutes } = this.state;
      onChange(selectedHours, selectedMinutes);
    });
  }

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (
      <View style={styles.container}>
        <Picker
          style={styles.picker}
          selectedValue={selectedHours}
          onValueChange={(itemValue) => this.handleChangeHours(itemValue)}
        >
          {this.getHoursItems()}
        </Picker>
        <Picker
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
