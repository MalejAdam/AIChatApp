import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  TextInput,
  IconButton,
  Surface,
  Text,
  ActivityIndicator,
  FAB,
  Menu,
} from "react-native-paper";
import { Href, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useChat } from "@/src/contexts/ChatContext";
import * as fileService from "@/src/services/fileService";
import * as chatService from "@/src/services/chatService";
import { FileInfo, FileType } from "@/src/services/fileService";
import { styles as root_styles, colors } from "@/src/styles";
import { urls } from "@/src/consts";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isGenerating?: boolean;
  attachment?: FileInfo;
}

export default function Chat() {
  const flatListRef = useRef<FlatList>(null);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<FileInfo | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { messages, setMessages } = useChat();

  const handleFilePick = async (type: FileType) => {
    try {
      setError(null);
      const file =
        type === "image"
          ? await fileService.pickImage()
          : await fileService.pickDocument();

      if (file) {
        fileService.validateFile(file);
        setAttachment(file);
      }
    } catch (error) {
      if (error instanceof fileService.FileError) {
        setError(error.message);
      } else {
        setError("Error uploading file");
      }
    } finally {
      setMenuVisible(false);
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: chatService.sendMessage,
    onMutate: () => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        attachment: attachment || undefined,
      };

      const generatingMessage: ChatMessage = {
        id: "generating",
        text: "Generating response...",
        isUser: false,
        isGenerating: true,
      };

      setMessages((prev) => [...prev, userMessage, generatingMessage]);
      setMessage("");
      setAttachment(null);
    },
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "generating").concat(aiMessage),
      );
    },
    onError: () => {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== "generating")
          .concat({
            id: Date.now().toString(),
            text: "Sorry, something went wrong. Please try again.",
            isUser: false,
          }),
      );
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderAttachment = (file: FileInfo) => {
    switch (file.type) {
      case "image":
        return (
          <Image
            source={{ uri: file.uri }}
            style={styles.attachmentImage}
            resizeMode="cover"
          />
        );
      case "pdf":
      case "document":
        return (
          <View style={styles.documentContainer}>
            <IconButton
              icon={file.type === "pdf" ? "file-pdf-box" : "file-document"}
              size={24}
            />
            <View style={styles.documentInfo}>
              <Text numberOfLines={1} style={styles.documentName}>
                {file.name}
              </Text>
              {file.size && (
                <Text style={styles.documentSize}>
                  {fileService.formatFileSize(file.size)}
                </Text>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <Surface
      style={[
        styles.messageBubble,
        item.isUser ? styles.userMessage : styles.aiMessage,
        item.isGenerating && styles.generatingMessage,
      ]}
    >
      <View style={styles.messageContent}>
        {item.attachment && renderAttachment(item.attachment)}
        {item.text && !item.isGenerating && (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
        {item.isGenerating && (
          <ActivityIndicator
            size={20}
            color="#666"
            style={styles.generatingIndicator}
          />
        )}
      </View>
    </Surface>
  );

  return (
    <View style={root_styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <IconButton icon="close" size={20} onPress={() => setError(null)} />
        </View>
      )}

      {attachment && (
        <View style={styles.attachmentPreview}>
          {renderAttachment(attachment)}
          <IconButton
            icon="close"
            size={20}
            onPress={() => setAttachment(null)}
            style={styles.removeAttachment}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="paperclip"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            leadingIcon="image"
            onPress={() => handleFilePick("image")}
            title="Image"
          />
          <Menu.Item
            leadingIcon="file-document"
            onPress={() => handleFilePick("document")}
            title="Document"
          />
        </Menu>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          disabled={isPending}
          right={
            <TextInput.Icon
              icon={() =>
                isPending ? (
                  <ActivityIndicator size={20} />
                ) : (
                  <IconButton
                    icon="send"
                    size={20}
                    onPress={() => mutate(message)}
                    disabled={(!message.trim() && !attachment) || isPending}
                  />
                )
              }
            />
          }
        />
      </View>

      <FAB
        icon="account"
        style={styles.fab}
        onPress={() => router.push(urls.profile as Href)}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContent: {
    width: "100%",
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.message.user,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.message.ai,
  },
  generatingMessage: {
    backgroundColor: colors.message.ai,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  documentSize: {
    fontSize: 12,
  },
  attachmentPreview: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.message.user,
  },
  removeAttachment: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.message.ai,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    margin: 8,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  inputContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.message.user,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
  },
  generatingIndicator: {
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 80,
    backgroundColor: colors.primary,
  },
});
