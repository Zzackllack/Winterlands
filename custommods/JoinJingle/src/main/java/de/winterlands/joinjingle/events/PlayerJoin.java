package de.winterlands.joinjingle.events;

import de.winterlands.joinjingle.sound.ModSounds;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.client.event.ClientPlayerNetworkEvent;

public class PlayerJoin {
    @SubscribeEvent
    public static void onPlayerJoin(ClientPlayerNetworkEvent.LoggingIn event) {
        Player player = event.getPlayer();

        player.playSound(ModSounds.JOIN_SOUND.value(), 1.0f, 1.0f
        );


    }
}
