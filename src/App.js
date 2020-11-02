import React, { useState, useEffect } from 'react';
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => {
      if (response.status === 200 && response.data) {
        setRepositories(response.data);
      }
    });
  }, []);


  async function handleLikeRepository(repositoryId) {
    const response = await api.post(`repositories/${repositoryId}/like`);
    if (response.status !== 200) { return };
    const repoCopy = repositories.map(repo => {
      if (repo.id === repositoryId) { repo.likes = (parseInt(repo.likes) + 1).toString() }
      return repo;
    });
    setRepositories(repoCopy);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        <FlatList
          data={repositories}
          keyExtractor={item => item.id}
          style={styles.container}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>

              <Text style={styles.repository}>{repository.title}</Text>

              <FlatList
                style={styles.techsContainer}
                data={repository.techs}
                keyExtractor={item => item}
                renderItem={({ item: tech }) => (
                  <Text style={styles.tech}>
                    {tech}
                  </Text>
                )}
              >
              </FlatList>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        >
        </FlatList>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
  },
  repository: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 20,
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
    maxWidth: 100,
  },
});
