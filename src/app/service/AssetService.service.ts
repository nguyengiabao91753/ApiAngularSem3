import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private renderer: Renderer2;
  private addedCss: HTMLLinkElement[] = [];
  private addedJs: HTMLScriptElement[] = [];

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addCss(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);

    this.addedCss.push(link);
  }

  addJs(src: string): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);

    this.addedJs.push(script);
  }

  // Remove CSS
  removeCss(href: string): void {
    const link = this.addedCss.find(l => l.href.includes(href));
    if (link) {
      this.renderer.removeChild(document.head, link);
      this.addedCss = this.addedCss.filter(l => l !== link); // Remove reference from the array
    }
  }
  removeJs(src: string): void {
    const script = this.addedJs.find(s => s.src.includes(src));
    if (script) {
      this.renderer.removeChild(document.body, script);
      this.addedJs = this.addedJs.filter(s => s !== script); // Remove reference from the array
    }
  }

  setTitle(title: string): void {
    document.title = title;
  }
}