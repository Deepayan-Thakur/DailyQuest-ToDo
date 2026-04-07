const GIST_FILENAME = 'questlog-save.json';
const GIST_DESC = 'QuestLog App Save Data';

export const gistService = {
  async authenticate(token: string) {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });
    if (!res.ok) throw new Error('Invalid token');
    return res.json();
  },
  
  async getSaveData(token: string) {
    const res = await fetch(`https://api.github.com/gists?t=${Date.now()}`, {
      cache: 'no-cache',
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch gists');
    
    const gists = await res.json();
    const saveGist = gists.find((g: any) => g.files[GIST_FILENAME]);
    
    if (saveGist) {
      const gistRes = await fetch(`${saveGist.url}?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json'
        }
      });
      const gistData = await gistRes.json();
      const content = gistData.files[GIST_FILENAME].content;
      return { gistId: saveGist.id, data: JSON.parse(content) };
    }
    return null;
  },
  
  async createSaveGist(token: string, initialData: any) {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        description: GIST_DESC,
        public: false,
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(initialData, null, 2) }
        }
      })
    });
    if (!res.ok) throw new Error('Failed to create gist');
    const data = await res.json();
    return data.id;
  },
  
  async updateSaveGist(token: string, gistId: string, data: any) {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) }
        }
      })
    });
    if (!res.ok) throw new Error('Failed to update gist');
  }
};
