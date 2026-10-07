import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as fs from 'fs';

import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

/**
 * J4 harness: independent component characterization, not a project test.
 * Renders the only two components with no required-data dependencies the
 * same way the project's own smoke specs do, then writes normalized
 * innerHTML so a Python-side harness step can diff it against a frozen
 * components.json. Never asserts pass/fail itself (see PROTOCOL.md).
 */
describe('J4 characterization (harness, not a project test)', () => {
  let footerFixture: ComponentFixture<FooterComponent>;
  let navbarFixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FooterComponent, NavbarComponent],
    }).compileComponents();
  }));

  it('captures frozen footer/navbar render output', () => {
    footerFixture = TestBed.createComponent(FooterComponent);
    footerFixture.detectChanges();
    navbarFixture = TestBed.createComponent(NavbarComponent);
    navbarFixture.detectChanges();

    const normalize = (html: string) => html.replace(/\s+/g, ' ').trim();
    const result = {
      footer: normalize(footerFixture.nativeElement.innerHTML),
      navbar: normalize(navbarFixture.nativeElement.innerHTML),
    };
    fs.writeFileSync('components.actual.json', JSON.stringify(result, null, 2));
    expect(result.footer.length).toBeGreaterThan(0);
    if (fs.existsSync('components.json')) {
      const frozen = JSON.parse(fs.readFileSync('components.json', 'utf8'));
      expect(result).toEqual(frozen);
    }
  });
});
