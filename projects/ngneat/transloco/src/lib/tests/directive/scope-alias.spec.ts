import { fakeAsync } from '@angular/core/testing';
import { TRANSLOCO_SCOPE, TranslocoDirective, TranslocoModule } from '@ngneat/transloco';
import { createComponentFactory, Spectator, SpectatorHost } from '@ngneat/spectator';
import { createFactory } from './shared';
import { providersMock, runLoader } from '../transloco.mocks';
import { Component } from '@angular/core';

describe('Scope alias', () => {
  let spectator: SpectatorHost<TranslocoDirective>;
  const createHost = createFactory([
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'lazy-page',
        alias: 'lazy'
      }
    }
  ]);

  it('should support scope alias', fakeAsync(() => {
    spectator = createHost(`<section *transloco="let t;"><div>{{t('lazy.title')}}</div></section>`);
    runLoader();
    runLoader();
    spectator.detectChanges();
    expect(spectator.query('div')).toHaveText('Admin Lazy english');
  }));
});

@Component({
  template: `
    <p>{{ 'lazy.title' | transloco }}</p>
    <h1>{{ 'nested.title' | transloco }}</h1>
  `
})
class TestPipe {}

describe('Scope alias pipe', () => {
  let spectator: Spectator<TestPipe>;
  const createComponent = createComponentFactory({
    component: TestPipe,
    imports: [TranslocoModule],
    providers: [
      providersMock,
      {
        provide: TRANSLOCO_SCOPE,
        useValue: {
          scope: 'lazy-page',
          alias: 'lazy'
        }
      }
    ]
  });

  it('should support scope alias', fakeAsync(() => {
    spectator = createComponent();
    runLoader();
    runLoader();
    spectator.detectChanges();
    expect(spectator.query('p')).toHaveText('Admin Lazy english');
  }));
});
