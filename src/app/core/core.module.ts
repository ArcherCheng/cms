import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CoreComponent } from './core/core.component';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { TabModule } from '../modules/tab/tab.module';
import { CoreRoutingModule } from './core-routing.module';
import { CoreService } from './core.service';

@NgModule({
  declarations: [CoreComponent, MenuComponent],
  imports: [ SharedModule, TabModule, CoreRoutingModule ],
  exports: [CoreComponent, MenuComponent ],
  providers: [CoreService]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import Core modules in the AppModule only.`
    );
  }
}
