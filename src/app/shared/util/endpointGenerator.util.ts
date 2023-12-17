import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';

export interface URLGeneratorParams {
  placeholder: string;
  value: any;
}

@Injectable({
  providedIn: 'any',
})
export class URLGenerator {
  base = env.API[env.BackendService].base;

  fetch(
    service: 'dataset' | 'algorithm',
    method: string,
    param?: URLGeneratorParams[]
  ): string {
    let URL: string = '';

    URL = URL + this.base;
    URL = (URL +
      (env.API[env.BackendService].endpoints[service] as any)[method]) as any;

    if (param) {
      param.forEach((el) => {
        URL = URL.replace(el.placeholder, el.value);
      });
    }

    return URL;
  }
}
