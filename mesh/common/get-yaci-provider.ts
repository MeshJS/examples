import { YaciProvider } from "@meshsdk/core";

export function getYaciProvider() {
  return new YaciProvider("http://localhost:8080/api/v1");
}
