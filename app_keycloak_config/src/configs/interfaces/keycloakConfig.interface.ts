export interface IKeycloakConfig {
  id?: string;

  realm: string;

  client: string;

  public: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
