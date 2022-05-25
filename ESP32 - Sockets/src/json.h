#ifndef json_H    // To make sure you don't declare the function more than once by including the header multiple times.
#define json_H

#include <ArduinoJson.h>
#include <string.h>
#include <bits/stdc++.h>

struct RawData {
  const char * dataType;
  float value;
};

struct EspData {
  const char * eid;
  const float version;
};

template <std::size_t SIZE>
StaticJsonDocument<200> convertToJson(std::array<RawData, SIZE> &rawData);

#endif