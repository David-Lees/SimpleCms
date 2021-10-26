import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(value: any): any {
    const sanitizedContent = DOMPurify.sanitize(value, { ADD_TAGS: ["iframe"], ADD_ATTR: ['width','height','style','loading','allow', 'allowfullscreen', 'frameborder', 'scrolling'] });
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }
}