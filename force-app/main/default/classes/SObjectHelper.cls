public with sharing class SObjectHelper {
  // get List<Map<String, String>> SObjects with filtering
  @AuraEnabled(cacheable=true)
  public static List<Map<String, String>> getSObjectListMap() {
    List<Map<String, String>> SObjectList = new List<Map<String, String>>();
    Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
    Set<String> sObjectNames = schemaMap.keySet();

    if (sObjectNames != null && !sObjectNames.isEmpty()) {
      for (string sobjName : sObjectNames) {
        Map<String, String> sObjMap = new Map<String, String>();
        String objLabel = schemaMap.get(sobjName).getDescribe().getLabel();
        Schema.SObjectType objType = schemaMap.get(sobjName);

        // Filter unwanted Sobjects e.g. CustomSettings, History, Share, Feed, ApexClass, Pages and etc..
        // but how to filter only Standart and Custom objects which are displayed in Object Manager??????
        if (
          !objType.getDescribe().isCustomSetting() &&
          objType.getDescribe().getRecordTypeInfos().size() > 0 &&
          objType.getDescribe().isCreateable() &&
          !sobjName.containsIgnoreCase('history') &&
          !sobjName.containsIgnoreCase('tag') &&
          !sobjName.containsIgnoreCase('share') &&
          !sobjName.containsIgnoreCase('feed')
        ) {
          sObjMap.put('label', objLabel);
          sObjMap.put('value', sobjName);
          SObjectList.add(sObjMap);
        }
      }
    }
    return SObjectList;
  }

  // get List<String> SObjects without filtering with sorting
  @AuraEnabled(cacheable=true)
  public static List<String> getSObjectsListString() {
    List<String> SObjectList = new List<String>();
    for (Schema.SObjectType o : Schema.getGlobalDescribe().values()) {
      SObjectList.add(o.getDescribe().getLabel());
    }
    SObjectList.sort();
    return SObjectList;
  }
}
