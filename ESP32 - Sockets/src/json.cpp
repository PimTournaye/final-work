#include <json.h>

template<std::size_t SIZE>
StaticJsonDocument<200> convertToJson(std::array<RawData, SIZE> &rawData){
  StaticJsonDocument<200> jsonData;
  for(const RawData dataItem: rawData){
    jsonData[dataItem.dataType] = dataItem.value;
  }
  return jsonData;
}