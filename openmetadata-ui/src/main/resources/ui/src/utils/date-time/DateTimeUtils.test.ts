/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { Settings } from 'luxon';
import {
  calculateInterval,
  customFormatDateTime,
  formatDate,
  formatDateTime,
  formatDateTimeLong,
  formatTimeDurationFromSeconds,
  isValidDateFormat,
} from './DateTimeUtils';

const systemLocale = Settings.defaultLocale;
const systemZoneName = Settings.defaultZone;

describe('DateTimeUtils tests', () => {
  beforeAll(() => {
    // Explicitly set locale and time zone to make sure date time manipulations and literal
    // results are consistent regardless of where tests are run
    Settings.defaultLocale = 'en-US';
    Settings.defaultZone = 'UTC';
    Date;
  });

  afterAll(() => {
    // Restore locale and time zone
    Settings.defaultLocale = systemLocale;
    Settings.defaultZone = systemZoneName;
  });

  it(`formatDateTime should formate date and time both`, () => {
    expect(formatDateTime(0)).toBe(`Jan 1, 1970, 12:00 AM`);
  });

  it(`formatDate should formate date and time both`, () => {
    expect(formatDate(0)).toBe(`Jan 1, 1970`);
  });

  it(`formatDateShort should formate date and time both`, () => {
    expect(formatDateTimeLong(0)).toBe(`Thu 1th January, 1970, 12:00 AM`);
  });

  it(`formatTimeDurationFromSeconds should formate date and time both`, () => {
    expect(formatTimeDurationFromSeconds(60)).toBe(`00:01:00`);
  });

  it(`customFormatDateTime should formate date and time both`, () => {
    expect(customFormatDateTime(0, 'yyyy/MM/dd')).toBe(`1970/01/01`);
  });
});

describe('Date and DateTime Format Validation', () => {
  it('isValidDateFormat should validate date format correctly', () => {
    expect(isValidDateFormat('yyyy-MM-dd')).toBe(true);
    expect(isValidDateFormat('dd-MM-yyyy')).toBe(true);
    expect(isValidDateFormat('MM/dd/yyyy')).toBe(true);
    expect(isValidDateFormat('dd/MM/yyyy')).toBe(true);
    expect(isValidDateFormat('yyyy/MM/dd')).toBe(true);
    expect(isValidDateFormat('invalid-format')).toBe(false);
  });

  it('isValidDateFormat should validate dateTime format correctly', () => {
    expect(isValidDateFormat('yyyy-MM-dd HH:mm:ss')).toBe(true);
    expect(isValidDateFormat('dd-MM-yyyy HH:mm:ss')).toBe(true);
    expect(isValidDateFormat('MM/dd/yyyy HH:mm:ss')).toBe(true);
    expect(isValidDateFormat('dd/MM/yyyy HH:mm:ss')).toBe(true);
    expect(isValidDateFormat('yyyy/MM/dd HH:mm:ss')).toBe(true);
    expect(isValidDateFormat('invalid-format')).toBe(false);
  });
});

describe('calculateInterval', () => {
  it('should return "0 Days, 0 Hours" for the same start and end time', () => {
    const startTime = 1710831125922;
    const endTime = 1710831125922;
    const result = calculateInterval(startTime, endTime);

    expect(result).toBe('0 Days, 0 Hours');
  });

  it('should return "0 Days, 0 Hours" for a small interval', () => {
    const startTime = 1710831125922;
    const endTime = 1710831125924;
    const result = calculateInterval(startTime, endTime);

    expect(result).toBe('0 Days, 0 Hours');
  });

  it('should return "1 Days, 0 Hours" for a 24-hour interval', () => {
    const startTime = 1710831125922;
    const endTime = startTime + 24 * 60 * 60 * 1000; // 24 hours later
    const result = calculateInterval(startTime, endTime);

    expect(result).toBe('1 Days, 0 Hours');
  });

  it('should return "2 Days, 8 Hours" for a 56-hour interval', () => {
    const startTime = 1710831125922;
    const endTime = startTime + 56 * 60 * 60 * 1000; // 56 hours later
    const result = calculateInterval(startTime, endTime);

    expect(result).toBe('2 Days, 8 Hours');
  });

  it('should handle invalid timestamps gracefully', () => {
    const startTime = NaN;
    const endTime = NaN;
    const result = calculateInterval(startTime, endTime);

    expect(result).toBe('Invalid interval');
  });

  it('should return correct interval when start and end time are in seconds', () => {
    const startTimeInSeconds = 1710831125;
    const endTimeInSeconds = startTimeInSeconds + 56 * 60 * 60; // 56 hours later
    const result = calculateInterval(startTimeInSeconds, endTimeInSeconds);

    expect(result).toBe('0 Days, 0 Hours');
  });
});
