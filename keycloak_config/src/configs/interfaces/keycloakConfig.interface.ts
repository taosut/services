export interface IKeycloakConfig {
  id?: string;

  realm: string;

  client: string;

  public: boolean;

  created_at?: Date;

  updated_at?: Date;
}
