declare module '@aws-sdk/lib-dynamodb' {
  export class DynamoDBDocumentClient {
    static from(client: any): any;
    send(command: any): Promise<any>;
  }
  export class QueryCommand {
    constructor(input: any);
  }
  export class PutCommand {
    constructor(input: any);
  }
  export class UpdateCommand {
    constructor(input: any);
  }
}

