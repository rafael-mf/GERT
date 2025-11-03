import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GERT - Gerenciamento de Chamados Técnicos';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // F1 - Abrir ajuda
    if (event.key === 'F1') {
      event.preventDefault();
      this.abrirAjuda();
    }
  }

  abrirAjuda() {
    // Abre a página de ajuda em uma nova janela
    const largura = 1000;
    const altura = 800;
    const left = (screen.width - largura) / 2;
    const top = (screen.height - altura) / 2;
    
    // Usa o caminho absoluto para o arquivo estático na pasta public
    const urlAjuda = window.location.origin + '/ajuda.html';
    
    window.open(
      urlAjuda,
      'GERT_Ajuda',
      `width=${largura},height=${altura},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no`
    );
  }
}
