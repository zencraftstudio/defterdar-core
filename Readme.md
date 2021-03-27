# Defterdar-Core

This library provides defterdar functionality and carries git executables for supported platforms. The following
functionality is exposed through the API, the undocumented methods should not be used.

## Public API

#### startAutoSnapshotTimer

```
startAutoSnapshotTimer(folderPath: string, intervalInSeconds: number, callback: CallableFunction)
```

#### stopNextSnapshotTimer

```
stopNextSnapshotTimer()
```

#### createTaggedSnapshot

```
createTaggedSnapshot(folderPath: string, tagMessage: string, callback: CallableFunction)
```

#### getCommitHistory

```
getCommitHistory(folderPath: string)
```

#### tagSnapshot

```
tagSnapshot(folderPath: string, commitHash: string, tagMessage: string)
```

#### getHistoryVersions

```
getHistoryVersions(folderPath: string) 
```

#### createHistoryVersion

```
createHistoryVersion(folderPath: string, commitHash: string, newHistoryName: string)
```

#### checkoutHistoryVersion

```
checkoutHistoryVersion(folderPath: string, historyVersionName: string)
```
