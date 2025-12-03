export interface Chakra {
  id: number;
  name: string;
  position: number;
  color: string;
  symbol_url?: string;
  continent?: string;
  right_statement?: string;
  status?: string;
  responsible_name?: string;
  responsible_email?: string;
  concepts?: ChakraConcept[];
  organs?: ChakraOrgan[];
  sciences?: ChakraScience[];
  responsibilities?: ChakraResponsibility[];
  questions?: ChakraQuestion[];
  basic_needs?: ChakraBasicNeed[];
  created_at?: string;
  updated_at?: string;
}

export interface ChakraConcept {
  concept: string;
  category?: string;
  user_id?: number;
  user_name?: string;
}

export interface ChakraOrgan {
  organ_name: string;
  description?: string;
  user_id?: number;
  user_name?: string;
}

export interface ChakraScience {
  science_name: string;
  description?: string;
  user_id?: number;
  user_name?: string;
}

export interface ChakraResponsibility {
  responsibility: string;
  category?: string;
  user_id?: number;
  user_name?: string;
}

export interface ChakraQuestion {
  question: string;
  is_resolved: boolean;
  user_id?: number;
  user_name?: string;
}

export interface ChakraBasicNeed {
  id: number;
  basic_need: string;
  description?: string;
  user_id?: number;
  user_name?: string;
}