## Feature Flag Utilities

### userInBucket

`userInBucket(userId: string, rollout: number) => boolean`

- **Description**: Determines if a user falls within the specified rollout percentage using consistent hashing with MurmurHash.
- **Parameters**:
  - `userId` (string): The unique user identifier.
  - `rollout` (number): The rollout percentage (0-100).
- **Returns**: `true` if the user should see the feature, `false` otherwise.
- **Why MurmurHash?**: Fast, non-cryptographic, stable across runtimes — ideal for consistent user bucketing.

### Example Usage

```typescript
const isEligible = userInBucket('user123', 10);
console.log(isEligible); // true if user falls within the 10% rollout
```

