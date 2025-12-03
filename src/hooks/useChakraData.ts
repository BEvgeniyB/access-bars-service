import { useState, useEffect, useMemo, useCallback } from 'react';

const ADMIN_API_URL = 'https://functions.poehali.dev/9471e2dc-0dfa-4927-9d58-74f7dc75819c';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  telegram_id: string;
  telegram_username?: string;
  chakra_id?: number;
}

interface Chakra {
  id: number;
  name: string;
  position: number;
  color: string;
  continent?: string;
  right_statement?: string;
  responsible_user_id?: number;
}

interface ChakraConcept {
  id: number;
  chakra_id: number;
  concept: string;
  category: string;
  user_id: number;
}

interface ChakraOrgan {
  id: number;
  chakra_id: number;
  organ_name: string;
  description: string;
  user_id: number;
}

interface ChakraScience {
  id: number;
  chakra_id: number;
  science_name: string;
  description: string;
  user_id: number;
}

interface ChakraResponsibility {
  id: number;
  chakra_id: number;
  responsibility: string;
  user_id: number;
}

interface ChakraBasicNeed {
  id: number;
  chakra_id: number;
  basic_need: string;
  description: string;
  user_id: number;
}

export const useChakraData = (token: string | null, selectedUserId: number | null) => {
  const [users, setUsers] = useState<User[]>([]);
  const [chakras, setChakras] = useState<Chakra[]>([]);
  
  const [concepts, setConcepts] = useState<ChakraConcept[]>([]);
  const [organs, setOrgans] = useState<ChakraOrgan[]>([]);
  const [sciences, setSciences] = useState<ChakraScience[]>([]);
  const [responsibilities, setResponsibilities] = useState<ChakraResponsibility[]>([]);
  const [basicNeeds, setBasicNeeds] = useState<ChakraBasicNeed[]>([]);
  
  const [allConcepts, setAllConcepts] = useState<ChakraConcept[]>([]);
  const [allOrgans, setAllOrgans] = useState<ChakraOrgan[]>([]);
  const [allSciences, setAllSciences] = useState<ChakraScience[]>([]);
  const [allResponsibilities, setAllResponsibilities] = useState<ChakraResponsibility[]>([]);
  const [allBasicNeeds, setAllBasicNeeds] = useState<ChakraBasicNeed[]>([]);

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId), [users, selectedUserId]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!token) throw new Error('No token');
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Auth-Token': token,
      },
    });
  }, [token]);

  const loadAllData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.users) {
        setUsers(data.users);
      }
      
      if (data.chakras) {
        const sorted = data.chakras.sort((a: Chakra, b: Chakra) => a.position - b.position);
        setChakras(sorted);
      }
      
      if (data.chakra_concepts) {
        setAllConcepts(data.chakra_concepts);
      }
      
      if (data.chakra_organs) {
        setAllOrgans(data.chakra_organs);
      }
      
      if (data.chakra_sciences) {
        setAllSciences(data.chakra_sciences);
      }
      
      if (data.chakra_responsibilities) {
        setAllResponsibilities(data.chakra_responsibilities);
      }
      
      if (data.chakra_basic_needs) {
        setAllBasicNeeds(data.chakra_basic_needs);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки данных:', err.message || err);
    }
  }, [token]);

  const loadUserData = useCallback(async () => {
    if (!token || !selectedUserId) return;

    const selectedUser = users.find((u) => u.id === selectedUserId);
    
    if (!selectedUser?.chakra_id) {
      setConcepts([]);
      setOrgans([]);
      setSciences([]);
      setResponsibilities([]);
      setBasicNeeds([]);
      return;
    }

    try {
      const chakraId = selectedUser.chakra_id;
      
      const [conceptsRes, organsRes, sciencesRes, responsibilitiesRes, basicNeedsRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?table=chakra_concepts&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_organs&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_sciences&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_responsibilities&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_basic_needs&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
      ]);

      const [conceptsData, organsData, sciencesData, responsibilitiesData, basicNeedsData] = await Promise.all([
        conceptsRes.json(),
        organsRes.json(),
        sciencesRes.json(),
        responsibilitiesRes.json(),
        basicNeedsRes.json(),
      ]);

      const userConcepts = (conceptsData.chakra_concepts || []).filter((c: ChakraConcept) => c.user_id === selectedUserId);
      const userOrgans = (organsData.chakra_organs || []).filter((o: ChakraOrgan) => o.user_id === selectedUserId);
      const userSciences = (sciencesData.chakra_sciences || []).filter((s: ChakraScience) => s.user_id === selectedUserId);
      const userResponsibilities = (responsibilitiesData.chakra_responsibilities || []).filter((r: ChakraResponsibility) => r.user_id === selectedUserId);
      const userBasicNeeds = (basicNeedsData.chakra_basic_needs || []).filter((bn: ChakraBasicNeed) => bn.user_id === selectedUserId);

      setConcepts(userConcepts);
      setOrgans(userOrgans);
      setSciences(userSciences);
      setResponsibilities(userResponsibilities);
      setBasicNeeds(userBasicNeeds);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
    }
  }, [token, selectedUserId, users]);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  useEffect(() => {
    loadUserData();
  }, [selectedUserId, users]);

  return {
    users,
    setUsers,
    chakras,
    selectedUser,
    concepts,
    setConcepts,
    organs,
    setOrgans,
    sciences,
    setSciences,
    responsibilities,
    setResponsibilities,
    basicNeeds,
    setBasicNeeds,
    allConcepts,
    allOrgans,
    allSciences,
    allResponsibilities,
    allBasicNeeds,
    authFetch,
    loadAllData,
    loadUserData,
  };
};