import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  [key: string]: string | Translation;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLangSubject.asObservable();

  private translations: { [lang: string]: Translation } = {
    pt: {
      // Authentication
      login: 'Entrar',
      register: 'Registrar',
      logout: 'Sair',
      email: 'Email',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
      rememberSession: 'Lembrar sessão',
      loginSubtitle: 'Entre na sua conta Pokédx',
      registerSubtitle: 'Crie sua conta Pokédx',
      name: 'Nome',
      lastName: 'Sobrenome',
      namePlaceholder: 'Seu nome',
      lastNamePlaceholder: 'Seu sobrenome',
      emailPlaceholder: 'usuario@exemplo.com',
      passwordPlaceholder: 'Digite sua senha',
      noAccount: 'Não tem uma conta?',
      registerHere: 'Registre-se aqui',
      hasAccount: 'Já tem uma conta?',
      loginHere: 'Entre aqui',
      
      // Form validation
      emailRequired: 'O email é obrigatório',
      emailInvalid: 'Formato de email inválido',
      passwordRequired: 'A senha é obrigatória',
      nameRequired: 'O nome é obrigatório',
      lastNameRequired: 'O sobrenome é obrigatório',
      passwordMismatch: 'As senhas não coincidem',
      
      // Navigation
      home: 'Início',
      pokedex: 'Pokédx',
      teams: 'Minha Equipe',
      
      // Home/Dashboard
      dashboardTitle: 'Painel Pokédx',
      dashboardSubtitle: 'Resumo do seu progresso e estatísticas',
      myPokemon: 'Meus Pokémon',
      lastFourAdded: 'Últimos 4 adicionados',
      noPokemonYet: 'Você ainda não capturou nenhum Pokémon',
      recommendedPokemon: 'Pokémon Recomendados',
      captureRecommendation: 'Recomendamos capturar estes Pokémon',
      recommended: 'Recomendados',
      topStrongPokemon: 'Top Pokémon fortes',
      
      // Team Detail
      goBack: 'Voltar',
      totalAttack: 'Ataque Total',
      totalDefense: 'Defesa Total',
      totalSpeed: 'Velocidade Total',
      totalHP: 'HP Total',
      typeDistribution: 'Distribuição de Tipos',
      teamPokemon: 'Pokémon da Equipe',
      remove: 'Remover',
      emptyTeam: 'Equipe vazia',
      addPokemonToTeam: 'Adicione Pokémon a esta equipe do seu Pokédx',
      loadingTeam: 'Carregando equipe...',
      
      addPokemon: 'Adicionar Pokémon',
      pokemonFound: 'Pokémon encontrados',
      searchPlaceholder: 'Buscar por nome',
      filterByType: 'Filtrar por tipo',
      allTypes: 'Todos os tipos',
      sortBy: 'Ordenar por',
      pokemonName: 'Nome',
      attack: 'Ataque',
      defense: 'Defesa',
      speed: 'Velocidade',
      level: 'Nível',
      clear: 'Limpar',
      noPokemonFound: 'Nenhum Pokémon encontrado com estes critérios',
      
      // Statistics
      totalPokemon: 'Total de Pokémon',
      pokedexCompleted: 'Pokédx Completo',
      averageLevel: 'Nível Médio',
      favoriteType: 'Tipo Favorito',
      totalExperience: 'Experiência Total',
      strongestPokemon: 'Pokémon Mais Forte',
      none: 'Nenhum',
      
      // Teams
      myTeam: 'Minha Equipe',
      newTeam: 'Nova Equipe',
      teamName: 'Nome da equipe',
      teamLimit: 'Limite de Pokémon',
      createTeam: 'Criar Equipe',
      teamCreatedSuccess: 'Equipe criada com sucesso',
      teamDeletedSuccess: 'Equipe excluída com sucesso',
      viewDetail: 'Ver Detalhes',
      noTeamsYet: 'Você não tem equipes criadas',
      createFirstTeam: 'Crie sua primeira equipe clicando em "Nova Equipe"',
      
      // General
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      confirm: 'Confirmar',
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Aviso',
      info: 'Informação',
      
      // Filters and Search
      filterByRegion: 'Filtrar por região',
      filterByGeneration: 'Filtrar por geração',
      searchByRegion: 'Buscar por região',
      region: 'Região',
      generation: 'Geração',
      allRegions: 'Todas as regiões',
      allGenerations: 'Todas as gerações',
      
      // New Modal Features
      pokemonDetail: 'Detalhes do Pokémon',
      stats: 'Estatísticas',
      physicalInfo: 'Informações Físicas',
      height: 'Altura',
      weight: 'Peso',
      experience: 'Experiência',
      battleInfo: 'Info de Batalha',
      totalPower: 'Poder Total',
      effectiveness: 'Efetividade',
      rank: 'Rank',
      addToPokedex: 'Adicionar ao Pokédx',
      inPokedex: 'No Pokédx',
      battleSimulator: 'Simulador de Batalha',
      comparePokemon: 'Comparar Pokémon',
      
      // Battle Simulator
      selectPokemon: 'Selecionar Pokémon',
      fighter1: 'Lutador 1',
      fighter2: 'Lutador 2',
      power: 'Poder',
      startBattle: 'Iniciar Batalha',
      wins: 'vence',
      battleSummary: 'Resumo da Batalha',
      totalRounds: 'Rounds Totais',
      totalDamage: 'Dano Total',
      battleDuration: 'Duração da Batalha',
      battleAgain: 'Batalhar Novamente',
      
      // Pokemon Comparison
      pokemonComparison: 'Comparação de Pokémon',
      selectFirstPokemon: 'Selecionar Primeiro Pokémon',
      selectSecondPokemon: 'Selecionar Segundo Pokémon',
      choosePokemon: 'Escolher Pokémon',
      basicInfo: 'Informações Básicas',
      attribute: 'Atributo',
      baseExperience: 'Experiência Base',
      types: 'Tipos',
      statsComparison: 'Comparação de Estatísticas',
      battlePrediction: 'Previsão de Batalha',
      offensiveRating: 'Classificação Ofensiva',
      defensiveRating: 'Classificação Defensiva',
      simulateBattle: 'Simular Batalha',
      compareOthers: 'Comparar Outros',
      exportResults: 'Exportar Resultados',
      
      // User Profile
      userProfile: 'Perfil do Usuário',
      firstName: 'Nome',
      favoriteLanguage: 'Idioma Favorito',
      trainerStats: 'Estatísticas do Treinador',
      totalTeams: 'Equipes Totais',
      battlesWon: 'Batalhas Vencidas',
      daysActive: 'Dias Ativo',
      achievements: 'Conquistas',
      preferences: 'Preferências',
      enableNotifications: 'Ativar Notificações',
      autoSaveTeams: 'Salvar Equipes Automaticamente',
      showHints: 'Mostrar Dicas',
      soundEffects: 'Efeitos Sonoros',
      saveChanges: 'Salvar Mudanças',
      resetChanges: 'Resetar Mudanças',
      deleteAccount: 'Excluir Conta',
      confirmDelete: 'Confirmar Exclusão',
      deleteAccountWarning: 'Esta ação não pode ser desfeita. Todos os seus dados serão perdidos permanentemente.',
      
      // Notifications
      notificationSuccess: 'Sucesso',
      notificationError: 'Erro',
      notificationWarning: 'Aviso',
      notificationInfo: 'Informação',
      notificationOk: 'OK',
      notificationConfirm: 'Confirmar',
      notificationAccept: 'Aceitar',
      profileSaved: 'Perfil salvo com sucesso',
      accountDeletion: 'A exclusão da conta seria processada aqui',
      confirmRemovePokemon: 'Tem certeza de que deseja remover este Pokémon da equipe?',
      confirmDeleteTeam: 'Tem certeza de que deseja excluir esta equipe?',
      viewMode: 'Modo de Visualização',
      allPokemon: 'Todos os Pokémon',
      pokemonAvailable: 'Pokémon Disponíveis',
      emptyPokedex: 'Sua Pokédex está vazia',
      noPokemonFoundFilter: 'Nenhum Pokémon encontrado',
      startCatchingPokemon: 'Comece a capturar Pokémon clicando em "Adicionar Pokémon"',
      noResultsFilter: 'Nenhum Pokémon encontrado com os critérios de busca aplicados',
      capturePokemon: 'Capturar Pokémon',
      captured: 'Capturado',
      clearFilters: 'Limpar',
      generation1: 'Geração 1 (1-151)',
      generation2: 'Geração 2 (152-251)',
      generation3: 'Geração 3 (252-386)',
      generation4: 'Geração 4 (387-493)',
      generation5: 'Geração 5 (494-649)'
    },
    es: {
      // Authentication
      login: 'Iniciar Sesión',
      register: 'Registro',
      logout: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      rememberSession: 'Recordar sesión',
      loginSubtitle: 'Ingresa a tu cuenta de Pokédx',
      registerSubtitle: 'Crea tu cuenta de Pokédx',
      name: 'Nombre',
      lastName: 'Apellido',
      namePlaceholder: 'Tu nombre',
      lastNamePlaceholder: 'Tu apellido',
      emailPlaceholder: 'usuario@ejemplo.com',
      passwordPlaceholder: 'Ingresa tu contraseña',
      noAccount: '¿No tienes una cuenta?',
      registerHere: 'Regístrate aquí',
      hasAccount: '¿Ya tienes una cuenta?',
      loginHere: 'Inicia sesión aquí',
      
      // Form validation
      emailRequired: 'El correo es obligatorio',
      emailInvalid: 'Formato de correo inválido',
      passwordRequired: 'La contraseña es obligatoria',
      nameRequired: 'El nombre es obligatorio',
      lastNameRequired: 'El apellido es obligatorio',
      passwordMismatch: 'Las contraseñas no coinciden',
      
      // Navigation
      home: 'Inicio',
      pokedex: 'Pokédx',
      teams: 'Mi Equipo',
      
      // Home/Dashboard
      dashboardTitle: 'Dashboard de Pokédx',
      dashboardSubtitle: 'Resumen de tu progreso y estadísticas',
      myPokemon: 'Mis Pokémon',
      lastFourAdded: 'Últimos 4 agregados',
      noPokemonYet: 'Aún no has capturado ningún Pokémon',
      recommendedPokemon: 'Pokémon Recomendados',
      captureRecommendation: 'Te recomendamos capturar estos Pokémon',
      recommended: 'Recomendados',
      topStrongPokemon: 'Top Pokémon fuertes',
      
      // Team Detail
      goBack: 'Volver',
      totalAttack: 'Ataque Total',
      totalDefense: 'Defensa Total', 
      totalSpeed: 'Velocidad Total',
      totalHP: 'HP Total',
      typeDistribution: 'Distribución de Tipos',
      teamPokemon: 'Pokémon del Equipo',
      remove: 'Remover',
      emptyTeam: 'Equipo vacío',
      addPokemonToTeam: 'Agrega Pokémon a este equipo desde tu Pokédex',
      loadingTeam: 'Cargando equipo...',
      
      addPokemon: 'Agregar Pokémon',
      pokemonFound: 'Pokémon encontrados',
      searchPlaceholder: 'Buscar Pokémon...',
      filterByType: 'Filtrar por tipo',
      sortBy: 'Ordenar por',
      myPokedex: 'Mi Pokédx',
      pokemonInPokedex: 'Pokémon en tu Pokédx',
      searchByNameType: 'Buscar por nombre, tipo o región',
      allTypes: 'Todos los tipos',
      allGenerations: 'Todas las generaciones',
      generation: 'Generación',
      
      // Teams
      createNewTeam: 'Crear Nuevo Equipo',
      teamName: 'Nombre del Equipo',
      pokemonLimit: 'Límite de Pokémon',
      addToTeam: 'Agregar al Equipo',
      
      // Stats
      totalCaptured: 'Pokémon Capturados',
      pokedexCompleted: 'Pokédx Completada',
      averageLevel: 'Nivel Promedio',
      favoriteType: 'Tipo Favorito',
      totalExperience: 'Experiencia Total',
      strongestPokemon: 'Pokémon Más Fuerte',
      none: 'Ninguno',
      
      // Common
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      loading: 'Cargando...',
      available: 'Disponible',
      inTeam: 'En equipo',
      alreadyAdded: 'Ya agregado',
      search: 'Buscar',
      filterByGeneration: 'Filtrar por Generación',
      
      // New Modal Features
      pokemonDetail: 'Detalles del Pokémon',
      stats: 'Estadísticas',
      physicalInfo: 'Información Física',
      height: 'Altura',
      weight: 'Peso',
      experience: 'Experiencia',
      battleInfo: 'Info de Batalla',
      totalPower: 'Poder Total',
      effectiveness: 'Efectividad',
      rank: 'Rango',
      addToPokedex: 'Agregar al Pokédx',
      inPokedex: 'En Pokédx',
      battleSimulator: 'Simulador de Batalla',
      comparePokemon: 'Comparar Pokémon',
      
      // Battle Simulator
      selectPokemon: 'Seleccionar Pokémon',
      fighter1: 'Luchador 1',
      fighter2: 'Luchador 2',
      power: 'Poder',
      startBattle: 'Iniciar Batalla',
      wins: 'gana',
      battleSummary: 'Resumen de Batalla',
      totalRounds: 'Rondas Totales',
      totalDamage: 'Daño Total',
      battleDuration: 'Duración de Batalla',
      battleAgain: 'Batallar de Nuevo',
      
      // Pokemon Comparison
      pokemonComparison: 'Comparación de Pokémon',
      selectFirstPokemon: 'Seleccionar Primer Pokémon',
      selectSecondPokemon: 'Seleccionar Segundo Pokémon',
      choosePokemon: 'Elegir Pokémon',
      basicInfo: 'Información Básica',
      attribute: 'Atributo',
      baseExperience: 'Experiencia Base',
      types: 'Tipos',
      statsComparison: 'Comparación de Estadísticas',
      battlePrediction: 'Predicción de Batalla',
      offensiveRating: 'Calificación Ofensiva',
      defensiveRating: 'Calificación Defensiva',
      simulateBattle: 'Simular Batalla',
      compareOthers: 'Comparar Otros',
      exportResults: 'Exportar Resultados',
      
      // User Profile
      userProfile: 'Perfil de Usuario',
      firstName: 'Nombre',
      favoriteLanguage: 'Idioma Favorito',
      trainerStats: 'Estadísticas del Entrenador',
      totalTeams: 'Equipos Totales',
      battlesWon: 'Batallas Ganadas',
      daysActive: 'Días Activo',
      achievements: 'Logros',
      preferences: 'Preferencias',
      enableNotifications: 'Activar Notificaciones',
      autoSaveTeams: 'Guardar Equipos Automáticamente',
      showHints: 'Mostrar Consejos',
      soundEffects: 'Efectos de Sonido',
      saveChanges: 'Guardar Cambios',
      resetChanges: 'Resetear Cambios',
      deleteAccount: 'Eliminar Cuenta',
      confirmDelete: 'Confirmar Eliminación',
      deleteAccountWarning: 'Esta acción no se puede deshacer. Todos tus datos se perderán permanentemente.',
      
      // Notifications
      notificationSuccess: 'Éxito',
      notificationError: 'Error',
      notificationWarning: 'Advertencia',
      notificationInfo: 'Información',
      notificationOk: 'Aceptar',
      notificationConfirm: 'Confirmar',
      notificationAccept: 'Aceptar',
      profileSaved: 'Perfil guardado exitosamente',
      accountDeletion: 'La eliminación de cuenta se procesaría aquí',
      confirmRemovePokemon: '¿Estás seguro de que deseas remover este Pokémon del equipo?',
      confirmDeleteTeam: '¿Estás seguro de que deseas eliminar este equipo?',
      viewMode: 'Modo de Vista',
      allPokemon: 'Todos los Pokémon',
      pokemonAvailable: 'Pokémon Disponibles',
      emptyPokedex: 'Tu Pokédex está vacía',
      noPokemonFoundFilter: 'No se encontraron Pokémon',
      startCatchingPokemon: 'Comienza a capturar Pokémon haciendo clic en "Agregar Pokémon"',
      noResultsFilter: 'No se encontraron Pokémon con los criterios de búsqueda aplicados',
      capturePokemon: 'Capturar Pokémon',
      captured: 'Capturado',
      clearFilters: 'Limpiar',
      generation1: 'Generación 1 (1-151)',
      generation2: 'Generación 2 (152-251)',
      generation3: 'Generación 3 (252-386)',
      generation4: 'Generación 4 (387-493)',
      generation5: 'Generación 5 (494-649)'
    },
    en: {
      // Authentication
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      rememberSession: 'Remember session',
      loginSubtitle: 'Enter your Pokédx account',
      registerSubtitle: 'Create your Pokédx account',
      name: 'Name',
      lastName: 'Last Name',
      namePlaceholder: 'Your name',
      lastNamePlaceholder: 'Your last name',
      emailPlaceholder: 'user@example.com',
      passwordPlaceholder: 'Enter your password',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      hasAccount: 'Already have an account?',
      loginHere: 'Login here',
      
      // Form validation
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      passwordRequired: 'Password is required',
      nameRequired: 'Name is required',
      lastNameRequired: 'Last name is required',
      passwordMismatch: 'Passwords do not match',
      
      // Navigation
      home: 'Home',
      pokedex: 'Pokédx',
      teams: 'My Team',
      
      // Home/Dashboard
      dashboardTitle: 'Pokédx Dashboard',
      dashboardSubtitle: 'Summary of your progress and statistics',
      myPokemon: 'My Pokémon',
      lastFourAdded: 'Last 4 added',
      noPokemonYet: "You haven't captured any Pokémon yet",
      recommendedPokemon: 'Recommended Pokémon',
      captureRecommendation: 'We recommend capturing these Pokémon',
      recommended: 'Recommended',
      topStrongPokemon: 'Top strong Pokémon',
      
      // Team Detail
      goBack: 'Back',
      totalAttack: 'Total Attack',
      totalDefense: 'Total Defense',
      totalSpeed: 'Total Speed', 
      totalHP: 'Total HP',
      typeDistribution: 'Type Distribution',
      teamPokemon: 'Team Pokémon',
      remove: 'Remove',
      emptyTeam: 'Empty Team',
      addPokemonToTeam: 'Add Pokémon to this team from your Pokédex',
      loadingTeam: 'Loading team...',
      
      addPokemon: 'Add Pokémon',
      pokemonFound: 'Pokémon found',
      searchPlaceholder: 'Search Pokémon...',
      filterByType: 'Filter by type',
      sortBy: 'Sort by',
      myPokedex: 'My Pokédx',
      pokemonInPokedex: 'Pokémon in your Pokédx',
      searchByNameType: 'Search by name, type or region',
      allTypes: 'All types',
      allGenerations: 'All generations',
      generation: 'Generation',
      
      // Teams
      createNewTeam: 'Create New Team',
      teamName: 'Team Name',
      pokemonLimit: 'Pokémon Limit',
      addToTeam: 'Add to Team',
      
      // Stats
      totalCaptured: 'Pokémon Captured',
      pokedexCompleted: 'Pokédx Completed',
      averageLevel: 'Average Level',
      favoriteType: 'Favorite Type',
      totalExperience: 'Total Experience',
      strongestPokemon: 'Strongest Pokémon',
      none: 'None',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      available: 'Available',
      inTeam: 'In team',
      alreadyAdded: 'Already added',
      search: 'Search',
      filterByGeneration: 'Filter by Generation',
      
      // New Modal Features
      pokemonDetail: 'Pokémon Details',
      stats: 'Stats',
      physicalInfo: 'Physical Info',
      height: 'Height',
      weight: 'Weight',
      experience: 'Experience',
      battleInfo: 'Battle Info',
      totalPower: 'Total Power',
      effectiveness: 'Effectiveness',
      rank: 'Rank',
      addToPokedex: 'Add to Pokédx',
      inPokedex: 'In Pokédx',
      battleSimulator: 'Battle Simulator',
      comparePokemon: 'Compare Pokémon',
      
      // Battle Simulator
      selectPokemon: 'Select Pokémon',
      fighter1: 'Fighter 1',
      fighter2: 'Fighter 2',
      power: 'Power',
      startBattle: 'Start Battle',
      wins: 'wins',
      battleSummary: 'Battle Summary',
      totalRounds: 'Total Rounds',
      totalDamage: 'Total Damage',
      battleDuration: 'Battle Duration',
      battleAgain: 'Battle Again',
      
      // Pokemon Comparison
      pokemonComparison: 'Pokémon Comparison',
      selectFirstPokemon: 'Select First Pokémon',
      selectSecondPokemon: 'Select Second Pokémon',
      choosePokemon: 'Choose Pokémon',
      basicInfo: 'Basic Info',
      attribute: 'Attribute',
      baseExperience: 'Base Experience',
      types: 'Types',
      statsComparison: 'Stats Comparison',
      battlePrediction: 'Battle Prediction',
      offensiveRating: 'Offensive Rating',
      defensiveRating: 'Defensive Rating',
      simulateBattle: 'Simulate Battle',
      compareOthers: 'Compare Others',
      exportResults: 'Export Results',
      
      // User Profile
      userProfile: 'User Profile',
      firstName: 'First Name',
      favoriteLanguage: 'Favorite Language',
      trainerStats: 'Trainer Stats',
      totalTeams: 'Total Teams',
      battlesWon: 'Battles Won',
      daysActive: 'Days Active',
      achievements: 'Achievements',
      preferences: 'Preferences',
      enableNotifications: 'Enable Notifications',
      autoSaveTeams: 'Auto Save Teams',
      showHints: 'Show Hints',
      soundEffects: 'Sound Effects',
      saveChanges: 'Save Changes',
      resetChanges: 'Reset Changes',
      deleteAccount: 'Delete Account',
      confirmDelete: 'Confirm Delete',
      deleteAccountWarning: 'This action cannot be undone. All your data will be permanently lost.',
      
      // Notifications
      notificationSuccess: 'Success',
      notificationError: 'Error',
      notificationWarning: 'Warning',
      notificationInfo: 'Information',
      notificationOk: 'OK',
      notificationConfirm: 'Confirm',
      notificationAccept: 'Accept',
      profileSaved: 'Profile saved successfully',
      accountDeletion: 'Account deletion would be processed here',
      confirmRemovePokemon: 'Are you sure you want to remove this Pokémon from the team?',
      confirmDeleteTeam: 'Are you sure you want to delete this team?',
      viewMode: 'View Mode',
      allPokemon: 'All Pokémon',
      pokemonAvailable: 'Pokémon Available',
      emptyPokedex: 'Your Pokédex is empty',
      noPokemonFoundFilter: 'No Pokémon found',
      startCatchingPokemon: 'Start catching Pokémon by clicking "Add Pokémon"',
      noResultsFilter: 'No Pokémon found with the applied search criteria',
      capturePokemon: 'Capture Pokémon',
      captured: 'Captured',
      clearFilters: 'Clear',
      generation1: 'Generation 1 (1-151)',
      generation2: 'Generation 2 (152-251)',
      generation3: 'Generation 3 (252-386)',
      generation4: 'Generation 4 (387-493)',
      generation5: 'Generation 5 (494-649)'
    }
  };

  constructor() {
    // Load saved language or default to Spanish
    const savedLang = localStorage.getItem('pokemon-app-language') || 'es';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLangSubject.next(lang);
      localStorage.setItem('pokemon-app-language', lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  translate(key: string): string {
    const lang = this.getCurrentLanguage();
    const translation = this.getNestedTranslation(this.translations[lang], key);
    return translation || key;
  }

  private getNestedTranslation(obj: Translation, key: string): string {
    const keys = key.split('.');
    let result: any = obj;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return '';
      }
    }
    
    return typeof result === 'string' ? result : '';
  }

  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' },
      { code: 'pt', name: 'Português' }
    ];
  }
}