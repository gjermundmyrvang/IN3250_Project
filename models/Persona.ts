type Persona = {
    name: string;
    age: number;
    lives_in: string;
    image?: string;
    background: {
      occupation?: string;
      current_status?: string;
      reason_for_retirement?: string;
      living_situation?: string;
      hobbies?: string[];
      technology_usage?: string;
    };
    goals?: string[];
    frustrations?: string[];
    motivations?: string[];
    technology_comfort_level?: {
      devices?: {
        name?: string;
        usage?: string;
      }[];
      feelings_about_technology?: string;
    };
    health?: {
      physical_conditions?: {
        name?: string;
        impact?: string;
      }[];
      mental_health?: {
        status?: string;
      };
    };
    social_life?: {
      family?: string;
      friends?: string;
      social_challenges?: string;
    };
  };