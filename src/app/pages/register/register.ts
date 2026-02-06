
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { ApiService } from '../../services/api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'register',
  imports: [MatButtonModule, MatCardModule, MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule, MatChipsModule, MatIconModule, FormsModule, ReactiveFormsModule, MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule, NgxMaskDirective,
    NgxMaskDirective,
    MatProgressSpinnerModule,
    MatToolbarModule, RouterLink],
  providers: [
    // Isso força espec
    // ificamente o Datepicker a usar o padrão brasileiro
    provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],


  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form: FormGroup;

  forCad: FormGroup;

  fordMat: FormGroup;

  carregando = signal(false);
  arquivoGerado = signal<Blob | null>(null);

  escola: string | null = null;
  tema: string = "";
  nome: string = "";
  materia: string = "";

  readonly materias = signal<string[]>([
    'Português',
    'Matemática',
    'História',
    'Geografia',
    'Ciências',
    'Arte',
    "E.D Fisica"
  ]);

  readonly materiaisUltilizados = signal<string[]>([
    'Material Estruturado Nova Escola', 'PNLD', 'Cantinho da leitura',
    'Sequência didátiica',
    'Livro Paradidático',
    'Acervo Literário',
    'Revistas/jornais',
    'Atividades impressas',
    'Material luz do saber',
    'Link de vídeos e atividades',
    'Jogos educativos',
    'Aplicativos/Plataformas',
    'Biblioteca virtual',
    'Música/Vídeo',
    'Aula de campo',
    'Gincana',
    'Caixa de som, notebook, data show, microfone...',
    'Internet',
    'Fichas de leitura',
    'Caixa das Ciências Humanas',
    'Cartazes interativos',
    'Cantinhos pedagógicos',
    'Caderno/lápis/caneta/borracha',
    'Canetinhas/lápis de cor/giz de cera/pinceis',
    'Cola/durex/grampeador/ fita gomada/clipes',
    'Tesoura/apontador/estilete',
    'Cartolina/eva/papeis afins'



  ]);


  // Pegamos apenas os itens e transformamos em um array único de strings
  readonly todosItens = signal<string[]>([
    'Música bom dia', 'Oração', 'Agenda do dia', 'Chamada do dia', 'Ajudante do dia',
    'Calendário/Relógio', 'Aniversariantes', 'Roda de conversa', 'Atividade de casa',
    'Aconchego literário', 'Alforje de história', 'Projeto de leitura',
    'Atividade com material concreto', 'Dinâmicas/desafios',
    'Aula expositiva', 'Compreensão oral', 'Compreensão escrita', 'Produção textual',
    'Palco da leitura', 'Cochicho literário', 'Tempo para gostar de ler',
    'Oficinas de leitura', 'Encaminhamentos da atividade de casa', 'Organização e despedida'
  ]);

  constructor(private fb: FormBuilder, private planoService: ApiService, private cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      // Um único FormArray de booleanos (um para cada string acima)
      listaItens: this.fb.array(this.todosItens().map(() => new FormControl(false)), minSelectedCheckboxes(1)),

    });

    this.forCad = this.fb.group({
      escola: ['', [Validators.required, Validators.minLength(3)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cor: ['', [Validators.required, Validators.minLength(3)]],
      tema: ['', [Validators.required]],
      mat: ['', [Validators.required]],
      turma: ['', [Validators.required]],
      data: [null as Date | null, Validators.required],
      alunos: ['', Validators.required]
    });

    this.fordMat = this.fb.group({
      listaMateriais: this.fb.array(this.materiaisUltilizados().map(() => new FormControl(false)), minSelectedCheckboxes(1)),
    });
  }


  estaSelecionada(materia: string): boolean {
    // Pegamos o valor do controle 'mat' dentro do grupo 'forCad'
    const selecionadas = this.forCad.get('mat')?.value as string[] || [];
    return selecionadas.includes(materia);
  }





  get listaItensArray() {
    return this.form.get('listaItens') as FormArray;


  }

  get listamateriasArray() {
    return this.fordMat.get('listaMateriais') as FormArray;
  }

  subimit() {


    this.carregando.set(true);

    if (this.arquivoGerado()) {
      this.arquivoGerado.set(null)
    }


    const itensselecionados = this.listaItensArray.value
      .map((marcado: boolean, i: number) => marcado ? this.todosItens()[i] : null)
      .filter((v: any) => v !== null);

    const materiasselecionados = this.listamateriasArray.value
      .map((marcado: boolean, i: number) => marcado ? this.materiaisUltilizados()[i] : null)
      .filter((v: any) => v !== null);


    const payload = {
      tema: this.forCad.value.tema,
      escola: this.forCad.value.escola,
      professor: this.forCad.value.nome,
      data: this.forCad.value.data ? this.forCad.value.data.toISOString().split('T')[0] : null, // Método auxiliar abaixo
      materia: this.forCad.value.mat,
      alunos: this.forCad.value.alunos, // Ou pegue de um campo se houver
      coordenador: this.forCad.value.cor, // Mapeando o campo 'cor' como coordenador
      metodologia: itensselecionados,
      materiais: materiasselecionados,
      turma: this.forCad.value.turma
    };

    console.log('Enviando JSON:', payload);



    this.planoService.gerarDocumentoWord(payload).subscribe({
      next: (blob) => {

        this.arquivoGerado.set(blob);
        this.carregando.set(false)




      },
      error: (err) => {
        this.carregando.set(false)
        this.cd.detectChanges();
        console.error('Erro ao conectar com o back-end:', err);
        alert("erro ao gerar o plano tente novamente mais tarde")
      }
    });

    // No topo da classe, seu Signal deve estar assim:
    // arquivoGerado = signal<Blob | null>(null);


  }

  baixarArquivo() {
    // Para ler o valor de um Signal, você deve chamá-lo como uma função: ()
    const blob = this.arquivoGerado();

    if (!blob) {
      console.error('Nenhum arquivo gerado para baixar.');
      return;
    }

    try {
      // Cria a URL para o conteúdo do Blob
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      // Define o nome do arquivo (pode ser dinâmico vindo de outro Signal)
      link.download = `Plano_de_Aula_${new Date().toLocaleDateString('pt-BR')}.docx`;

      // Aciona o download
      link.click();

      // Importante para performance e memória
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erro ao processar o download:', error);
    }
  }


  gerarMascaraData(event: any) {
    let v = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (v.length > 8) v = v.substring(0, 8); // Limita a 8 números

    // Adiciona as barras conforme a quantidade de números
    if (v.length >= 5) {
      v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (v.length >= 3) {
      v = v.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }

    event.target.value = v;
  }

  enviar() {
    // Mapeia os booleanos de volta para as strings
    const selecionados = this.listaItensArray.value
      .map((marcado: boolean, i: number) => marcado ? this.todosItens()[i] : null)
      .filter((v: any) => v !== null);

    console.log('Itens selecionados:', selecionados);
  }

  escolaErro(): string | null {

    const esolaControl = this.forCad.get('escola');

    if (esolaControl?.hasError('required')) return ' o campo escola é obrigatorio'

    if (esolaControl?.hasError('minlength')) return ' o campo escola deve possuir no minimo três letras'
    return null
  }

  dataErro(): string | null {

    const dataControl = this.forCad.get('data');

    if (dataControl?.hasError('required')) return ' o campo data é obrigatorio'


    return null
  }

  nomeErro(): string | null {

    const nomeControl = this.forCad.get('nome');

    if (nomeControl?.hasError('required')) return ' o campo professor é obrigatorio'

    if (nomeControl?.hasError('minlength')) return ' o campo professor deve possuir no minimo três letras'
    return null
  }

  corErro(): string | null {

    const corControl = this.forCad.get('cor');

    if (corControl?.hasError('required')) return ' o campo coordenador é obrigatorio'

    if (corControl?.hasError('minlength')) return ' o campo coordenador deve possuir no minimo três letras'
    return null
  }

  matErro(): string | null {

    const matControl = this.forCad.get('mat');

    if (matControl?.hasError('required')) return ' o campo materia é obrigatorio'


    return null
  }

  turmaErro(): string | null {

    const turmaControl = this.forCad.get('turma');

    if (turmaControl?.hasError('required')) return ' o campo turma é obrigatorio'


    return null
  }

  temaErro(): string | null {

    const temaControl = this.forCad.get('tema');

    if (temaControl?.hasError('required')) return ' o campo tema é obrigatorio'

    if (temaControl?.hasError('minlength')) return ' o campo tema deve possuir no minimo três letras'
    return null
  }


}




export function minSelectedCheckboxes(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // O valor do FormArray será um array de booleanos: [true, false, false...]
    const selecionados = control.value as boolean[];

    // Contamos quantos são 'true'
    const totalSelected = selecionados ? selecionados.filter(v => v === true).length : 0;

    // Se o total for maior ou igual ao mínimo, está válido (retorna null)
    // Caso contrário, retorna um objeto de erro
    return totalSelected >= min ? null : { AtLeastOneRequired: true };
  };

}

function provideNativeDateAdapter(): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}
function baixarArquivo() {
  throw new Error('Function not implemented.');
}

