import { PixelIconName } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { StatTone } from '../../shared/ui/stat-bar/stat-bar.component';

export interface SkillStat {
  name: string;
  value: number;
  tone: StatTone;
  hint: string;
}

export interface SkillGroup {
  key: string;
  label: string;
  icon: PixelIconName;
  skills: SkillStat[];
}

export interface EquipmentItem {
  name: string;
  description: string;
  icon: PixelIconName;
}

export interface CharacterProfile {
  name: string;
  alias: string;
  className: string;
  title: string;
  level: number;
  location: string;
  availability: string;
  bio: string[];
  traits: string[];
  equipment: EquipmentItem[];
  skillGroups: SkillGroup[];
}

export const CHARACTER_PROFILE: CharacterProfile = {
  name: 'Gabus',
  alias: 'Gabus.dev',
  className: 'Front-end Developer / UX-UI Designer',
  title: 'Arquitecto de interfaces',
  level: 20,
  location: 'Remoto · Mundo digital',
  availability: 'Disponible para proyectos',
  bio: [
    'Soy desarrollador front-end y diseñador UX/UI. Mi aventura consiste en convertir ideas complejas en interfaces claras, accesibles y con personalidad.',
    'Trabajo principalmente con Angular, TypeScript y CSS moderno, y complemento el front-end con Spring Boot, PostgreSQL y Docker cuando el proyecto necesita un stack completo. También exploro el desarrollo móvil con Android y Java.',
    'Me interesa especialmente el punto donde el diseño y la ingeniería se encuentran: sistemas de componentes, accesibilidad, rendimiento y esos pequeños detalles que hacen que una interfaz se sienta bien.'
  ],
  traits: [
    'Detalle visual',
    'Accesibilidad primero',
    'Código limpio',
    'Aprendizaje continuo'
  ],
  equipment: [
    { name: 'Angular', description: 'Componentes standalone y signals', icon: 'sword' },
    { name: 'Spring Boot', description: 'API REST y seguridad', icon: 'shield' },
    { name: 'PostgreSQL', description: 'Persistencia relacional', icon: 'scroll' },
    { name: 'Docker', description: 'Entornos reproducibles', icon: 'save' },
    { name: 'Android', description: 'Aplicaciones móviles con Java', icon: 'user' },
    { name: 'Git', description: 'Historial y trabajo en ramas', icon: 'code' },
    { name: 'Figma', description: 'Diseño y prototipado', icon: 'book' },
    { name: 'Traefik', description: 'Reverse proxy y despliegue', icon: 'map' }
  ],
  skillGroups: [
    {
      key: 'frontend',
      label: 'Front-end',
      icon: 'sword',
      skills: [
        {
          name: 'Angular',
          value: 92,
          tone: 'hp',
          hint: 'Componentes standalone, signals y routing'
        },
        {
          name: 'TypeScript',
          value: 88,
          tone: 'hp',
          hint: 'Tipado estricto y patrones escalables'
        },
        {
          name: 'CSS & UI',
          value: 90,
          tone: 'mp',
          hint: 'Layouts, animación y sistemas de diseño'
        }
      ]
    },
    {
      key: 'backend',
      label: 'Back-end',
      icon: 'shield',
      skills: [
        {
          name: 'Spring Boot',
          value: 74,
          tone: 'exp',
          hint: 'API REST, JPA y seguridad'
        },
        {
          name: 'PostgreSQL',
          value: 72,
          tone: 'exp',
          hint: 'Modelado relacional y consultas'
        }
      ]
    },
    {
      key: 'design',
      label: 'Diseño',
      icon: 'book',
      skills: [
        {
          name: 'UX/UI',
          value: 86,
          tone: 'mp',
          hint: 'Flujos, jerarquía visual y prototipado'
        },
        {
          name: 'Accesibilidad',
          value: 84,
          tone: 'mp',
          hint: 'WCAG 2.2 AA, teclado y lectores de pantalla'
        }
      ]
    },
    {
      key: 'tools',
      label: 'Herramientas',
      icon: 'save',
      skills: [
        {
          name: 'Docker',
          value: 70,
          tone: 'gold',
          hint: 'Contenedores y despliegues reproducibles'
        },
        {
          name: 'Git',
          value: 82,
          tone: 'gold',
          hint: 'Flujos de ramas y conventional commits'
        }
      ]
    }
  ]
};
